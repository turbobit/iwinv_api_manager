interface RequestConfig {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, string>;
  body?: unknown;
}

export class NetworkAdapter {
  private baseUrl = 'https://api-krb.iwinv.kr';
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly maxRequestsPerMinute = 60;

  constructor(
    private readonly accessKey: string,
    private readonly secretKey: string
  ) {}

  private resetRequestCountIfNeeded() {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
  }

  private async checkRateLimit() {
    this.resetRequestCountIfNeeded();
    
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = 60000 - (Date.now() - this.lastResetTime);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
    }
    
    this.requestCount++;
  }

  private async generateHeaders(path: string): Promise<Headers> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await this.generateSignature(timestamp, path);

    return new Headers({
      'X-iwinv-Timestamp': timestamp,
      'X-iwinv-Credential': this.accessKey,
      'X-iwinv-Signature': signature,
      'Content-Type': 'application/json',
    });
  }

  private async generateSignature(timestamp: string, path: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(timestamp + path);
    const key = encoder.encode(this.secretKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      data
    );

    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async request<T>({ path, method = 'GET', queryParams, body }: RequestConfig): Promise<T> {
    await this.checkRateLimit();
    
    const headers = await this.generateHeaders(path);
    const url = new URL(path, this.baseUrl);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.group('API Request Debug');
      console.log('URL:', url.toString());
      console.log('Method:', method);
      console.log('Headers:', Object.fromEntries(headers.entries()));
      console.log('Query Params:', queryParams);
      console.log('Body:', body);
      console.groupEnd();
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (process.env.NODE_ENV === 'development') {
      console.group('API Response Debug');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.groupEnd();
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
} 