import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Service for making authenticated HTTP requests to the backend API
 * Handles authorization headers and error logging for all API calls
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.base_url;
  constructor() { }

  /**
   * Sends a POST request to the specified endpoint with provided data
   * @param endpoint The API endpoint to post to (appended to base URL)
   * @param data The JSON data to send in the request body
   * @returns Promise containing the response body
   * @throws Error if the request fails
   */
  async postData<T = any>(endpoint: string, data: any): Promise<T> {
    try {
      return await firstValueFrom(this.post$<T>(endpoint, data));
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  /**
 * Sends a POST request to the specified endpoint with provided data
 * @param endpoint The API endpoint to post to (appended to base URL)
 * @param data The JSON data to send in the request body
 * @returns Observable containing the response body
 * @throws Error if the request fails
 */
  post$<T = any>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Sends a DELETE request to the specified endpoint with query parameters
   * @param endpoint The API endpoint to delete from (appended to base URL)
   * @param params The query parameters to include in the request
   * @returns Promise containing the response body
   * @throws Error if the request fails
   */
  async deleteData<T = any>(endpoint: string, params: Record<string, any>): Promise<T> {
    try {
      return await firstValueFrom(this.delete$<T>(endpoint, params));
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  /**
 * Sends a DELETE request to the specified endpoint with query parameters
 * @param endpoint The API endpoint to delete from (appended to base URL)
 * @param params The query parameters to include in the request
 * @returns Observable containing the response body
 * @throws Error if the request fails
 */
  delete$<T = any>(endpoint: string, params: Record<string, any>): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  /**
   * Sends a GET request to the specified endpoint with query parameters
   * @param endpoint The API endpoint to fetch from (appended to base URL)
   * @param params The query parameters to include in the request
   * @returns Promise containing the response body
   * @throws Error if the request fails
   */
  async getData<T = any>(endpoint: string, params: Record<string, any>): Promise<T> {
    try {
      return await firstValueFrom(this.get$<T>(endpoint, params));
    } catch (error) {
      console.error('Error getting data:', error); // Fixed error message
      throw error;
    }
  }

  /**
 * Sends a GET request to the specified endpoint with query parameters
 * @param endpoint The API endpoint to fetch from (appended to base URL)
 * @param params The query parameters to include in the request
 * @returns Observable containing the response body
 * @throws Error if the request fails
 */
  get$<T = any>(endpoint: string, params: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }
}
