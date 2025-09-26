import { HttpHeaders } from "@angular/common/http";
import { IResponse } from "../interfaces/iresponses";
import { environment } from "../env/environment.prod";

export const store = {
    // Save data to sessionStorage with Base64 encoding
    setItem(key: string, value: any): void {
        // halt if irregularity in key or value
        if (!String(key).trim().length || !String(value).trim().length) return

        // encrypt key
        key = window.btoa(key).replace(/=/g, '').toUpperCase().split('').reverse().join('');

        const encodedValue = btoa(JSON.stringify(value)); // Encode to Base64
        sessionStorage.setItem(key, encodedValue);
    },
    
    // Retrieve data from sessionStorage and decode it
    getItem<T>(key: string): T | null {

        // halt if irregularity in key
        if (!String(key).trim().length) return null;
        // encrypt key
        key = window.btoa(key).replace(/=/g, '').toUpperCase().split('').reverse().join('');

        const storedValue = sessionStorage.getItem(key);
        if (!storedValue) return null;

        try {
            const decodedValue = JSON.parse(atob(storedValue)); // Decode from Base64
            return decodedValue as T;
        } catch (error) {
            console.error('Error decoding sessionStorage value:', error);
            return null;
        }
    },
    
    // Remove item from sessionStorage
    removeItem(key: string): void {
        // halt if irregularity in key
        if (!String(key).trim().length)
        // encrypt key
        key = window.btoa(key).replace(/=/g, '').toUpperCase().split('').reverse().join('');
        sessionStorage.removeItem(key);
    },
    
    // Clear all sessionStorage data
    clear(): void {
    sessionStorage.clear();
    },

    has(key: string): any {
        if (!String(key).trim().length) return
        let holder = key
        key = window.btoa(key).replace(/=/g, '').toUpperCase().split('').reverse().join('');
        return (String(this.getItem(holder)).length > 0)
      },
}

export const config = {
    base: environment.baseUrl,
    url : "",
    httpOptions(): any {
        // get token
        
        let token = store.getItem('token')
        // return headers object
        if (!token) {
            console.error('Token is not available.');
            return { headers: new HttpHeaders() };
        }
        return {
            headers: new HttpHeaders({
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, X-Requested-With",
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            })
        };
    },

    httpOptionsNoAuth: (): any => {
        return {
          headers: new HttpHeaders({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, X-Requested-With",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        }
    },

    stringify(item: any) {
        return JSON.stringify(item)
    },

    fromJson<T>(json: any): T {
      return JSON.parse(json) as T;
    },
}

// Common Response Formatter
export const formatResponse = <T>(response: any): IResponse<T> => {
    const { statusCode = 500, isError = true, msg = 'Unexpected response', data = null } = response;
    
    return {
        statusCode,
        isError,
        msg,
        data
    } as IResponse<T>;
};

export const formatTaskApiResponse = <T>(response: any): IResponse<T> => {
    debugger
  return {
    statusCode: response.code || 200,
    isError: response.status !== 'SUCCESS',
    msg: response.message || 'Success',
    data: response.data || null
  } as IResponse<T>;
};