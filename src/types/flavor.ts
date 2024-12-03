interface Price {
  type: string;
  KRW: {
    price: number;
    vat: number;
    total: number;
  };
}

interface Spec {
  type: string;
  vcpu: number;
  memory: number;
  disk: number;
  network: number;
  gpu: null | string;
}

export interface Flavor {
  flavor_id: string;
  name: string;
  provide: string;
  status: string;
  spec: Spec;
  supporting_images: string[];
  zone: string[];
  price: {
    full: Price;
    partial: Price;
  };
}

export interface FlavorListResponse {
  code: string;
  error_code: string;
  message: string;
  result: Flavor[];
  count: number;
  page_no: number;
  page_size: number;
}

export interface FlavorDetailResponse {
  code: string;
  error_code: string;
  message: string;
  result: [Flavor];
  count: number;
} 