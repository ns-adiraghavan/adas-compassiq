import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useCountryContext } from "@/contexts/CountryContext";
import { useLandscapeAnalysisData } from "./useLandscapeAnalysisData";
import { useWaypointData } from "./useWaypointData";

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
  
  // Get OEM data for landscape page
  const { data: waypointData } = useWaypointData();
  const firstAvailableOEM = waypointData?.csvData?.length > 0 ? 
    Array.from(new Set(
      waypointData.csvData.flatMap(file => 
        file.data && Array.isArray(file.data) ? 
          file.data.map((row: any) => row.OEM).filter(oem => 
            oem && typeof oem === 'string' && 
            !oem.toLowerCase().includes('merged') &&
            !oem.toLowerCase().includes('monitoring')
          ) : []
      )
    )).sort()[0] : null;
  
  const landscapeData = useLandscapeAnalysisData(firstAvailableOEM || "", selectedCountry || "");

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
    
    // Add section-specific data when available
    let sectionData = null;
    if (currentSection === 'landscape' && landscapeData) {
      sectionData = landscapeData;
    }
    
    return {
      currentSection,
      selectedCountry: selectedCountry || 'Global',
      selectedOEMs: firstAvailableOEM ? [firstAvailableOEM] : [],
      sectionData
    };
  }, [getCurrentSection, selectedCountry, firstAvailableOEM, landscapeData]);

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