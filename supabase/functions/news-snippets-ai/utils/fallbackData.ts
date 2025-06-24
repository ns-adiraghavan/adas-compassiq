
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
          url: 'https://www.autonews.com/'
        },
        {
          id: 2,
          title: 'Global OEM Competitive Strategies Update',
          summary: `Latest strategic moves and market positioning by leading automotive manufacturers`,
          source: 'Reuters Business',
          timestamp: '4 hours ago',
          url: 'https://www.reuters.com/business/autos-transportation/'
        },
        {
          id: 3,
          title: `${selectedCountry} Auto Industry Market Dynamics`,
          summary: 'Regional market dynamics and competitive landscape analysis',
          source: 'Bloomberg',
          timestamp: '6 hours ago',
          url: 'https://www.bloomberg.com/automotive'
        }
      ];
    
    case 'category-analysis':
      return [
        {
          id: 1,
          title: 'Automotive Feature Innovation Trends 2024',
          summary: `Technology category developments and feature availability across ${oemsText}`,
          source: 'TechCrunch',
          timestamp: '1 hour ago',
          url: 'https://techcrunch.com/category/transportation/'
        },
        {
          id: 2,
          title: `${selectedCountry} Vehicle Technology Categories`,
          summary: 'Analysis of technology adoption and feature distribution by category',
          source: 'Motor Trend',
          timestamp: '3 hours ago',
          url: 'https://www.motortrend.com/news/'
        },
        {
          id: 3,
          title: 'OEM Feature Differentiation Analysis',
          summary: 'How automotive brands differentiate through technology categories',
          source: 'Car and Driver',
          timestamp: '5 hours ago',
          url: 'https://www.caranddriver.com/news/'
        }
      ];
    
    case 'business-model':
      return [
        {
          id: 1,
          title: 'Automotive Business Model Evolution 2024',
          summary: `Revenue model evolution and subscription services by ${oemsText}`,
          source: 'Forbes',
          timestamp: '1 hour ago',
          url: 'https://www.forbes.com/business/'
        },
        {
          id: 2,
          title: `${selectedCountry} Auto Industry Revenue Innovation`,
          summary: 'Partnership models and monetization strategies in automotive sector',
          source: 'Financial Times',
          timestamp: '4 hours ago',
          url: 'https://www.ft.com/'
        },
        {
          id: 3,
          title: 'Next-Gen OEM Partnership Models',
          summary: 'New business approaches and collaborative strategies',
          source: 'Wall Street Journal',
          timestamp: '6 hours ago',
          url: 'https://www.wsj.com/'
        }
      ];
    
    case 'vehicle-segment':
      return [
        {
          id: 1,
          title: `${selectedCountry} Vehicle Segment Performance 2024`,
          summary: `SUV, sedan, and EV segment analysis for ${oemsText}`,
          source: 'Electrek',
          timestamp: '2 hours ago',
          url: 'https://electrek.co/'
        },
        {
          id: 2,
          title: 'Electric Vehicle Segment Growth Trends',
          summary: 'EV adoption trends and segment distribution across manufacturers',
          source: 'InsideEVs',
          timestamp: '3 hours ago',
          url: 'https://insideevs.com/'
        },
        {
          id: 3,
          title: 'Luxury vs Mass Market Segment Analysis',
          summary: 'Feature distribution and positioning across vehicle segments',
          source: 'Autoblog',
          timestamp: '5 hours ago',
          url: 'https://www.autoblog.com/'
        }
      ];
    
    default:
      return [
        {
          id: 1,
          title: `${selectedCountry} Automotive Market Update`,
          summary: `Latest developments involving ${oemsText} and industry trends`,
          source: 'Reuters',
          timestamp: '1 hour ago',
          url: 'https://www.reuters.com/business/autos-transportation/'
        },
        {
          id: 2,
          title: 'Global Automotive Technology Developments',
          summary: 'Innovation and technology adoption across automotive manufacturers',
          source: 'Automotive News',
          timestamp: '3 hours ago',
          url: 'https://www.autonews.com/'
        },
        {
          id: 3,
          title: 'Automotive Industry Market Analysis',
          summary: 'Regional market insights and competitive developments',
          source: 'Bloomberg',
          timestamp: '5 hours ago',
          url: 'https://www.bloomberg.com/automotive'
        }
      ];
  }
}
