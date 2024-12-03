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
  description: string | null;
  status: string;
  provide: string;
  start_date: string;
  stop_date: string | null;
  default_account: {
    username: string;
    password: string;
  };
  ip: Array<{
    public: {
      address: string;
      attached: boolean;
    };
    private: {
      address: string;
      netmask: string;
      network: string;
      broadcast: string;
      gateway: string;
    };
    type: string;
  }>;
  zone: {
    zone_id: string;
    name: string;
  };
  flavor: {
    flavor_id: string;
    name: string;
    type: string;
    vcpu: number;
    memory: number;
    disk: number;
    network: number;
    gpu: null | string;
  };
  image: {
    image_id: string;
    visibility: string;
    os: {
      type: string;
      name: string;
      status: string;
      content: string[];
      os_type: string;
      version: string;
      oid: string;
    };
    image_type: string;
    zone: string[];
  };
  monitoring: {
    port: string;
    resource: string;
  };
  block_storage: Volume[];
  vnc: {
    link: string;
    type: string;
  };
  connection_limit: {
    block_storage: number;
    ip: number;
  };
  traffic: {
    default: number;
    period: string;
    limit: number | null;
    reset_allow_count: number | null;
  };
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