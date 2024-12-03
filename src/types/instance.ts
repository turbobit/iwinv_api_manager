interface Network {
  network_id: string;
  name: string;
  ip: string;
  mac: string;
  type: string;
  status: string;
}

interface Volume {
  volume_id: string;
  name: string;
  size: number;
  type: string;
  status: string;
}

interface Instance {
  instance_id: string;
  name: string;
  description: string;
  status: string;
  power: string;
  task: string | null;
  flavor: {
    flavor_id: string;
    name: string;
    spec: {
      type: string;
      vcpu: number;
      memory: number;
      disk: number;
      network: number;
    }
  };
  image: {
    image_id: string;
    name: string;
    os_type: string;
    version: string;
  };
  networks: Network[];
  volumes: Volume[];
  zone: string;
  created_at: string;
  updated_at: string;
}

export interface InstanceListResponse {
  code: string;
  error_code: string;
  message: string;
  result: Instance[];
  count: number;
  page_no: number;
  page_size: number;
}

export interface InstanceDetailResponse {
  code: string;
  error_code: string;
  message: string;
  result: [Instance];
  count: number;
}

export interface CreateInstanceRequest {
  name: string;
  description?: string;
  flavor_id: string;
  image_id: string;
  network_id: string;
  zone: string;
  user_script_id?: string;
}

export type { Instance, Network, Volume }; 