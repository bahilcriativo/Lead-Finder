export interface SearchParams {
  token: string;
  type: 'google' | 'maps';
  audience: string;
  region: string;
  ddi: string;
  source: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  position?: number;
}

export interface MapsResult {
  title: string;
  address: string;
  phoneNumber?: string;
  category?: string;
  rating?: number;
  link?: string;
}
