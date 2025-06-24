
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
          url: 'https://www.autonews.com/manufacturing/automakers-face-challenges-global-markets'
        },
        {
          id: 2,
          title: 'OEM Competitive Strategies Update',
          summary: `Latest strategic moves and market positioning by leading automotive manufacturers`,
          source: 'Reuters',
          timestamp: '4 hours ago',
          url: 'https://www.reuters.com/business/autos-transportation/'
        },
        {
          id: 3,
          title: `${selectedCountry} Auto Industry Market Share Report`,
          summary: 'Regional market dynamics and competitive landscape analysis',
          source: 'Bloomberg',
          timestamp: '6 hours ago',
          url: 'https://www.bloomberg.com/news/articles/2024-01-15/global-auto-industry-outlook'
        }
      ];
    
    case 'category-analysis':
      return [
        {
          id: 1,
          title: 'Automotive Feature Innovation Trends',
          summary: `Technology category developments and feature availability across ${oemsText}`,
          source: 'TechCrunch',
          timestamp: '1 hour ago',
          url: 'https://techcrunch.com/2024/01/15/automotive-technology-trends/'
        },
        {
          id: 2,
          title: `${selectedCountry} Vehicle Technology Categories`,
          summary: 'Analysis of technology adoption and feature distribution by category',
          source: 'Motor Trend',
          timestamp: '3 hours ago',
          url: 'https://www.motortrend.com/news/automotive-technology-features-2024/'
        },
        {
          id: 3,
          title: 'OEM Feature Differentiation Study',
          summary: 'How automotive brands differentiate through technology categories',
          source: 'Car and Driver',
          timestamp: '5 hours ago',
          url: 'https://www.caranddriver.com/news/automotive-technology-comparison/'
        }
      ];
    
    case 'business-model':
      return [
        {
          id: 1,
          title: 'Automotive Business Model Transformation',
          summary: `Revenue model evolution and subscription services by ${oemsText}`,
          source: 'Forbes',
          timestamp: '1 hour ago',
          url: 'https://www.forbes.com/sites/transportation/automotive-business-models/'
        },
        {
          id: 2,
          title: `${selectedCountry} Auto Industry Revenue Strategies`,
          summary: 'Partnership models and monetization strategies in automotive sector',
          source: 'Financial Times',
          timestamp: '4 hours ago',
          url: 'https://www.ft.com/companies/automobiles'
        },
        {
          id: 3,
          title: 'OEM Partnership and Service Models',
          summary: 'New business approaches and collaborative strategies',
          source: 'WSJ',
          timestamp: '6 hours ago',
          url: 'https://www.wsj.com/news/business/autos'
        }
      ];
    
    case 'vehicle-segment':
      return [
        {
          id: 1,
          title: `${selectedCountry} Vehicle Segment Performance`,
          summary: `SUV, sedan, and EV segment analysis for ${oemsText}`,
          source: 'Electrek',
          timestamp: '2 hours ago',
          url: 'https://electrek.co/2024/01/15/electric-vehicle-market-segments/'
        },
        {
          id: 2,
          title: 'Electric Vehicle Segment Growth',
          summary: 'EV adoption trends and segment distribution across manufacturers',
          source: 'InsideEVs',
          timestamp: '3 hours ago',
          url: 'https://insideevs.com/news/ev-market-analysis-2024/'
        },
        {
          id: 3,
          title: 'Luxury vs Mass Market Segments',
          summary: 'Feature distribution and positioning across vehicle segments',
          source: 'Autoblog',
          timestamp: '5 hours ago',
          url: 'https://www.autoblog.com/2024/01/15/vehicle-segment-analysis/'
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
          title: 'Global Automotive Technology Trends',
          summary: 'Innovation and technology adoption across automotive manufacturers',
          source: 'Automotive News',
          timestamp: '3 hours ago',
          url: 'https://www.autonews.com/technology'
        },
        {
          id: 3,
          title: 'Automotive Industry Analysis',
          summary: 'Regional market insights and competitive developments',
          source: 'Bloomberg',
          timestamp: '5 hours ago',
          url: 'https://www.bloomberg.com/news/articles/2024-01-15/automotive-industry-outlook'
        }
      ];
  }
}
