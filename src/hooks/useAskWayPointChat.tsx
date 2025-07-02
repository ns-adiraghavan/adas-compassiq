import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useCountryContext } from "@/contexts/CountryContext";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  id: string;
}

interface ChatContextData {
  currentSection: string;
  selectedCountry: string;
  selectedOEMs: string[];
  sectionData?: any;
  globalData?: any;
}

export function useAskWayPointChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { selectedCountry } = useCountryContext();

  const getCurrentSection = useCallback(() => {
    console.log('Getting current section from path:', location.pathname);
    const path = location.pathname;
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/intelligence')) return 'intelligence';
    if (path.includes('/modeling')) return 'modeling';
    if (path.includes('/insights')) return 'insights';
    return 'landscape';
  }, [location.pathname]);

  const getContextData = useCallback((): ChatContextData => {
    // Get context based on current page
    const currentSection = getCurrentSection();
    
    // You can extend this to get specific data from the current page context
    // For now, we'll use basic context information
    return {
      currentSection,
      selectedCountry: selectedCountry || 'Global',
      selectedOEMs: [], // This can be passed as props if needed
    };
  }, [getCurrentSection, selectedCountry]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const contextData = getContextData();
      
      const { data, error: functionError } = await supabase.functions.invoke('ask-waypoint-chat', {
        body: {
          message: message.trim(),
          conversationHistory: messages,
          contextData
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date().toISOString(),
        id: `ai-${Date.now()}`
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        id: `error-${Date.now()}`
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, getContextData]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addWelcomeMessage = useCallback(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hello! I'm WayPoint AI, your assistant for connected car features analysis. I can help you understand the data, compare OEMs, analyze trends, and provide insights based on the current section you're viewing. What would you like to know?`,
        timestamp: new Date().toISOString(),
        id: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addWelcomeMessage,
    currentSection: getCurrentSection()
  };
}