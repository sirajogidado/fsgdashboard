
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Search, FileText, BookOpen, Shield, Lightbulb } from "lucide-react";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  relevance: number;
  category: string;
  lastUpdated: string;
}

interface SearchRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  relevance: number;
}

const IntelligentSearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<SearchRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    certificates: true,
    documents: true,
    regulations: true,
  });

  const performSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-search', {
        body: { 
          query,
          includeRecommendations,
          filters: searchFilters
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      setRecommendations(data.recommendations || []);

      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} results`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <Shield className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'regulation': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return 'bg-green-100 text-green-800';
    if (relevance >= 0.7) return 'bg-blue-100 text-blue-800';
    if (relevance >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intelligent Search</h1>
        <p className="text-muted-foreground">
          AI-powered search across certificates, documents, and regulations with smart recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for certificates, documents, regulations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              className="flex-1"
            />
            <Button onClick={performSearch} disabled={loading || !query.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="certificates"
                checked={searchFilters.certificates}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, certificates: !!checked }))
                }
              />
              <label htmlFor="certificates" className="text-sm">Certificates</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documents"
                checked={searchFilters.documents}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, documents: !!checked }))
                }
              />
              <label htmlFor="documents" className="text-sm">Documents</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regulations"
                checked={searchFilters.regulations}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, regulations: !!checked }))
                }
              />
              <label htmlFor="regulations" className="text-sm">Regulations</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={includeRecommendations}
                onCheckedChange={(checked) => setIncludeRecommendations(!!checked)}
              />
              <label htmlFor="recommendations" className="text-sm">Include Recommendations</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(result.type)}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{result.title}</h3>
                          <Badge variant="outline">{result.category}</Badge>
                          <Badge className={getRelevanceColor(result.relevance)}>
                            {Math.round(result.relevance * 100)}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.description}</p>
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(result.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(rec.type)}
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query && results.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntelligentSearchPage;
