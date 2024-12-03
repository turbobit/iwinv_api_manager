interface OS {
  type: string;
  name: string;
  status: string;
  content: string[];
  os_type: string;
  version: string;
  oid: string;
}

interface Image {
  name: string;
  image_id: string;
  visibility: string;
  os: OS;
  image_type: string;
  zone: string[];
  tags: string[];
  status: string;
  protected: boolean;
  description: string;
  min_disk: number;
  min_ram: number;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface ImageListResponse {
  code: string;
  error_code: string;
  message: string;
  result: Image[];
  count: number;
  page_no: number;
  page_size: number;
}

export interface ImageDetailResponse {
  code: string;
  error_code: string;
  message: string;
  result: [Image];
  count: number;
}

export type { Image }; 