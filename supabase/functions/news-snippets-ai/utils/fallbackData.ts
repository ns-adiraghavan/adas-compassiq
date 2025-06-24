
export interface NewsSnippet {
  id: number;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  url: string;
}

export function generateContextualFallback(selectedOEMs: string[], selectedCountry: string, analysisType: string): NewsSnippet[] {
  const oemsText = selectedOEMs.length > 0 ? selectedOEMs.join(', ') : 'Major OEMs';
  
  switch (analysisType) {
    case 'landscape':
      return [
        {
          id: 1,
          title: `${selectedCountry} Automotive Market Leadership Analysis`,
          summary: `Competitive positioning and market share trends among ${oemsText} in ${selectedCountry}`,
          source: 'Automotive News',
          timestamp: '2 hours ago',
          url: 'https://autonews.com/market-landscape'
        },
        {
          id: 2,
          title: 'OEM Competitive Strategies Update',
          summary: `Latest strategic moves and market positioning by leading automotive manufacturers`,
          source: 'Reuters',
          timestamp: '4 hours ago',
          url: 'https://reuters.com/automotive-strategy'
        },
        {
          id: 3,
          title: `${selectedCountry} Auto Industry Market Share Report`,
          summary: 'Regional market dynamics and competitive landscape analysis',
          source: 'Industry Analysis',
          timestamp: '6 hours ago',
          url: 'https://example.com/market-share-report'
        }
      ];
    
    case 'category-analysis':
      return [
        {
          id: 1,
          title: 'Automotive Feature Innovation Trends',
          summary: `Technology category developments and feature availability across ${oemsText}`,
          source: 'Tech Automotive',
          timestamp: '1 hour ago',
          url: 'https://techautomotive.com/feature-analysis'
        },
        {
          id: 2,
          title: `${selectedCountry} Vehicle Technology Categories`,
          summary: 'Analysis of technology adoption and feature distribution by category',
          source: 'Auto Tech Report',
          timestamp: '3 hours ago',
          url: 'https://autotechreport.com/categories'
        },
        {
          id: 3,
          title: 'OEM Feature Differentiation Study',
          summary: 'How automotive brands differentiate through technology categories',
          source: 'Market Research',
          timestamp: '5 hours ago',
          url: 'https://example.com/feature-differentiation'
        }
      ];
    
    case 'business-model':
      return [
        {
          id: 1,
          title: 'Automotive Business Model Transformation',
          summary: `Revenue model evolution and subscription services by ${oemsText}`,
          source: 'Business Auto',
          timestamp: '1 hour ago',
          url: 'https://businessauto.com/business-models'
        },
        {
          id: 2,
          title: `${selectedCountry} Auto Industry Revenue Strategies`,
          summary: 'Partnership models and monetization strategies in automotive sector',
          source: 'Financial Times',
          timestamp: '4 hours ago',
          url: 'https://ft.com/automotive-revenue'
        },
        {
          id: 3,
          title: 'OEM Partnership and Service Models',
          summary: 'New business approaches and collaborative strategies',
          source: 'Strategy Report',
          timestamp: '6 hours ago',
          url: 'https://example.com/partnership-models'
        }
      ];
    
    case 'vehicle-segment':
      return [
        {
          id: 1,
          title: `${selectedCountry} Vehicle Segment Performance`,
          summary: `SUV, sedan, and EV segment analysis for ${oemsText}`,
          source: 'Segment Analysis',
          timestamp: '2 hours ago',
          url: 'https://segmentanalysis.com/vehicle-segments'
        },
        {
          id: 2,
          title: 'Electric Vehicle Segment Growth',
          summary: 'EV adoption trends and segment distribution across manufacturers',
          source: 'EV News',
          timestamp: '3 hours ago',
          url: 'https://evnews.com/segment-growth'
        },
        {
          id: 3,
          title: 'Luxury vs Mass Market Segments',
          summary: 'Feature distribution and positioning across vehicle segments',
          source: 'Auto Segments',
          timestamp: '5 hours ago',
          url: 'https://example.com/luxury-mass-segments'
        }
      ];
    
    default:
      return [
        {
          id: 1,
          title: `${selectedCountry} Automotive Market Update`,
          summary: `Latest developments involving ${oemsText} and industry trends`,
          source: 'Industry Report',
          timestamp: '1 hour ago',
          url: 'https://example.com/market-update'
        },
        {
          id: 2,
          title: 'Global Automotive Technology Trends',
          summary: 'Innovation and technology adoption across automotive manufacturers',
          source: 'Tech News',
          timestamp: '3 hours ago',
          url: 'https://example.com/tech-trends'
        },
        {
          id: 3,
          title: 'Automotive Industry Analysis',
          summary: 'Regional market insights and competitive developments',
          source: 'Market Research',
          timestamp: '5 hours ago',
          url: 'https://example.com/industry-analysis'
        }
      ];
  }
}
