export interface ContributeFormData {
  googleMapsUrl: string;
  reason: string;
  photos: File[];
}

export interface ContributeFormErrors {
  googleMapsUrl?: string;
}
