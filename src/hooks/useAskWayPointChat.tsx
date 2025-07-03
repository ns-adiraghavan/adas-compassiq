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
  const { data: waypointData } = useWaypointData();
  
  // Get complete dataset for AI context - not filtered
  const getCompleteDatasetSummary = useCallback(() => {
    if (!waypointData?.csvData?.length) return null;

    // Extract all OEMs, countries, features from complete dataset
    const allOEMs = new Set<string>();
    const allCountries = new Set<string>();
    const allFeatures = new Set<string>();
    const allCategories = new Set<string>();
    let totalRecords = 0;

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          totalRecords++;
          
          if (row.OEM && typeof row.OEM === 'string' && 
              !row.OEM.toLowerCase().includes('merged') &&
              !row.OEM.toLowerCase().includes('monitoring')) {
            allOEMs.add(row.OEM.trim());
          }
          
          if (row.Country && typeof row.Country === 'string') {
            allCountries.add(row.Country.trim());
          }
          
          if (row.Feature && typeof row.Feature === 'string') {
            allFeatures.add(row.Feature.trim());
          }
          
          if (row.Category && typeof row.Category === 'string') {
            allCategories.add(row.Category.trim());
          }
        });
      }
    });

    return {
      totalOEMs: allOEMs.size,
      totalCountries: allCountries.size,
      totalFeatures: allFeatures.size,
      totalCategories: allCategories.size,
      totalRecords,
      oemList: Array.from(allOEMs).sort(),
      countryList: Array.from(allCountries).sort(),
      categoryList: Array.from(allCategories).sort()
    };
  }, [waypointData]);

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
    const currentSection = getCurrentSection();
    const datasetSummary = getCompleteDatasetSummary();
    
    return {
      currentSection,
      selectedCountry: selectedCountry || 'Global',
      selectedOEMs: [],
      sectionData: datasetSummary, // Pass complete dataset summary instead of filtered data
      globalData: datasetSummary
    };
  }, [getCurrentSection, selectedCountry, getCompleteDatasetSummary]);

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