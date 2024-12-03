interface RequestConfig {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, string>;
  body?: unknown;
}

// API 관련 상수 정의
const API_CONSTANTS = {
  MAX_REQUESTS_PER_MINUTE: 60,
  RESET_INTERVAL: 60000, // 1분 (밀리초)
} as const;

// 에러 코드 타입 정의
type ErrorCode = 
  | 'SUCCESS'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR';

interface ApiResponse<T> {
  code: string;
  error_code: ErrorCode;
  message: string;
  result: T;
  count?: number;
}

interface ApiError {
  code: string;
  error_code: ErrorCode;
  message: string;
  result: "error";
}

export class NetworkAdapter {
  private baseUrl = 'https://api-kr.iwinv.kr';
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly maxRequestsPerMinute = API_CONSTANTS.MAX_REQUESTS_PER_MINUTE;

  constructor(
    private readonly accessKey: string,
    private readonly secretKey: string
  ) {}

  private resetRequestCountIfNeeded() {
    const now = Date.now();
    if (now - this.lastResetTime >= API_CONSTANTS.RESET_INTERVAL) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }
  }

  private async checkRateLimit() {
    this.resetRequestCountIfNeeded();
    
    if (this.requestCount >= this.maxRequestsPerMinute) {
      const waitTime = API_CONSTANTS.RESET_INTERVAL - (Date.now() - this.lastResetTime);
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

  private formatDebugTime(): string {
    return new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\. /g, '-').replace(/:/g, ':').replace(/\.$/, '');
  }

  private logDebugInfo(type: 'request' | 'response', data: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.group(`API ${type} Debug`);
      console.log('Timestamp:', this.formatDebugTime());
      Object.entries(data).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      console.groupEnd();
    }
  }

  async request<T>({ path, method = 'GET', queryParams, body }: RequestConfig): Promise<ApiResponse<T>> {
    try {
      await this.checkRateLimit();
      
      const headers = await this.generateHeaders(path);
      const url = new URL(path, this.baseUrl);
      
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      this.logDebugInfo('request', {
        'Full URL': url.toString(),
        'Base URL': this.baseUrl,
        'Path': path,
        'Method': method,
        'Headers': Object.fromEntries(headers.entries()),
        'Query Params': queryParams,
        'Body': body
      });

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      this.logDebugInfo('response', {
        'Status': response.status,
        'Status Text': response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json() as ApiError;
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json() as ApiResponse<T>;
      
      if (responseData.error_code !== 'SUCCESS') {
        throw new Error(responseData.message || 'API 요청 실패');
      }

      return responseData;
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw error;
    }
  }
} 