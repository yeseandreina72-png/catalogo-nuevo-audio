export type ServiceCategory =
  | 'all'
  | 'tarimas'
  | 'truss'
  | 'sonido'
  | 'iluminacion'
  | 'pantallas'
  | 'efectos'
  | 'energia';

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  image: string;
  fallbackImage?: string;
  features: string[];
  specs: TechnicalSpec[];
  idealFor: string[];
  badge?: string;
  popular?: boolean;
}

export interface EventPackage {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  description: string;
  included: string[];
  recommendedAudience: string;
  iconName: string;
}

export interface QuoteRequest {
  eventType: string;
  eventDate: string;
  eventTime: string;
  location: string;
  audienceSize: string;
  selectedEquipmentIds: string[];
  selectedPackageId?: string;
  needsGenerator: boolean;
  needsTrussRoof: boolean;
  needsLiveStreaming: boolean;
  needsStage: boolean;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}
