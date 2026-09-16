import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IRowFactorsScoresDto, IEpiDeliveryStatsDto } from '../dtos/IDashboardStatsDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.base_url}dashboard`;

  constructor(private http: HttpClient) { }

  getRowFactorsScores(): Observable<IRowFactorsScoresDto> {
    return this.http.get<IRowFactorsScoresDto>(`${this.apiUrl}/row-factors-scores`);
  }

  getEpiDeliveryStats(): Observable<IEpiDeliveryStatsDto> {
    return this.http.get<IEpiDeliveryStatsDto>(`${this.apiUrl}/epi-delivery-stats`);
  }
}
