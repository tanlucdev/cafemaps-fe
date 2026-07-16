export interface ContributeFormData {
  name: string;
  googleMapsUrl: string;
  reason: string;
  photos: File[];
}

export interface ContributeFormErrors {
  name?: string;
  googleMapsUrl?: string;
}
