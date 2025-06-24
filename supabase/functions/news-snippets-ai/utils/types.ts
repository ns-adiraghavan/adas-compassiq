
export interface NewsSnippetsRequest {
  selectedOEMs: string[];
  selectedCountry: string;
  analysisType: string;
}

export interface NewsSnippetsResponse {
  success: boolean;
  newsSnippets: any[];
  context?: any;
  error?: string;
}
