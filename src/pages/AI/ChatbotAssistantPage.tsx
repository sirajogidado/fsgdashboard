
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MessageCircle, Send, Bot, User, HelpCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatbotAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      initializeChatSession();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChatSession = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user?.id,
          session_name: `Chat Session ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(data.id);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your NCAA Aviation Assistant. I can help you with:

• Certificate requirements and procedures
• Aviation regulations and compliance
• Form completion guidance
• Process navigation
• General aviation questions

How can I assist you today?`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Chat Error",
        description: "Failed to initialize chat session.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Save user message to database
      await supabase
        .from('ai_chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: inputMessage
        });

      // Call the chatbot edge function
      const { data, error } = await supabase.functions.invoke('aviation-chatbot', {
        body: { 
          message: inputMessage,
          sessionId,
          context: 'aviation_assistant'
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase
        .from('ai_chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: data.response
        });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Here are some quick answers to common questions:\n\n• **AOC Applications**: Submit Form NCAA-AOC-001 with required documents\n• **Certificate Renewals**: Start process 60 days before expiry\n• **Compliance Issues**: Contact your assigned inspector\n• **Forms**: Available in the respective sections of this platform\n\nPlease try your question again, or contact support for assistance.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "How do I apply for an AOC?",
    "What documents are required for ATO certification?",
    "How long does certificate processing take?",
    "What are the AMO requirements?",
    "How do I renew my certificate?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Aviation Assistant</h1>
        <p className="text-muted-foreground">
          AI-powered chatbot to help with aviation regulations, procedures, and platform navigation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 h-full">
        <div className="md:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white ml-12'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Ask me anything about aviation procedures..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2 whitespace-normal"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assistant Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">✓</Badge>
                  <span>Certificate guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">✓</Badge>
                  <span>Regulation explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">✓</Badge>
                  <span>Form assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">✓</Badge>
                  <span>Process navigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">✓</Badge>
                  <span>Compliance help</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAssistantPage;
