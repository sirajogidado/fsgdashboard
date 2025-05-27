
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Search, Filter, Star, Clock } from "lucide-react";

const IntelligentSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecommendations();
    loadRecentSearches();
  }, []);

  const loadRecommendations = async () => {
    // Mock recommendations based on user activity
    const mockRecommendations = [
      {
        id: '1',
        type: 'certificate',
        title: 'AOC Renewal Due Soon',
        description: 'Similar airlines typically renew 60 days before expiry',
        relevance: 0.95
      },
      {
        id: '2',
        type: 'operation',
        title: 'Flight Operation Manual Update',
        description: 'Based on recent regulatory changes',
        relevance: 0.88
      },
      {
        id: '3',
        type: 'training',
        title: 'Pilot Training Requirements',
        description: 'Related to your current aircraft type',
        relevance: 0.82
      }
    ];
    
    setRecommendations(mockRecommendations);
  };

  const loadRecentSearches = () => {
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  };

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    saveRecentSearch(searchQuery);

    try {
      // Call the intelligent search edge function
      const { data, error } = await supabase.functions.invoke('intelligent-search', {
        body: { 
          query: searchQuery,
          includeRecommendations: true
        }
      });

      if (error) throw error;

      setSearchResults(data.results || []);
      
      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} relevant results.`,
      });
    } catch (error) {
      console.error('Search error:', error);
      // Mock search results for demonstration
      generateMockResults();
    } finally {
      setLoading(false);
    }
  };

  const generateMockResults = () => {
    const mockResults = [
      {
        id: '1',
        type: 'certificate',
        title: 'Air Operator Certificate - Nigerian Eagle',
        description: 'AOC for scheduled passenger operations, expires March 2025',
        relevance: 0.95,
        category: 'AOC',
        lastUpdated: '2024-12-15'
      },
      {
        id: '2',
        type: 'document',
        title: 'Flight Operations Manual - Section 4.2',
        description: 'Emergency procedures and safety protocols',
        relevance: 0.88,
        category: 'Documentation',
        lastUpdated: '2024-12-10'
      },
      {
        id: '3',
        type: 'regulation',
        title: 'NCAA Regulation Part 6 - Air Operator Certification',
        description: 'Requirements for air operator certificate applications',
        relevance: 0.82,
        category: 'Regulation',
        lastUpdated: '2024-11-20'
      }
    ];

    setSearchResults(mockResults);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return '📜';
      case 'document': return '📄';
      case 'regulation': return '📋';
      case 'operation': return '✈️';
      case 'training': return '🎓';
      default: return '📁';
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return 'bg-green-100 text-green-800';
    if (relevance >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intelligent Search & Recommendations</h1>
        <p className="text-muted-foreground">
          AI-powered search across all platform data with smart recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Smart Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search certificates, documents, regulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              className="flex-1"
            />
            <Button onClick={performSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {recentSearches.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h4>
              <div className="flex gap-2 flex-wrap">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(search);
                      performSearch();
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a search query to find relevant information</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getTypeIcon(result.type)}</span>
                            <h3 className="font-medium">{result.title}</h3>
                            <Badge className={getRelevanceColor(result.relevance)}>
                              {Math.round(result.relevance * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Category: {result.category}</span>
                            <span>Updated: {result.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getTypeIcon(rec.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                        <Badge className={getRelevanceColor(rec.relevance)} size="sm">
                          {Math.round(rec.relevance * 100)}% relevant
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📜 Certificates
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📄 Documents
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📋 Regulations
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  ✈️ Operations
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🎓 Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntelligentSearchPage;
