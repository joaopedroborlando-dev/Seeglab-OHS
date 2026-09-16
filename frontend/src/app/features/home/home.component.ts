import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/http/services/dashboard.service';
import { IRowFactorsScoresDto, IEpiDeliveryStatsDto } from '../../core/http/dtos/IDashboardStatsDto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  rowFactorsScores: IRowFactorsScoresDto | null = null;
  epiDeliveryStats: IEpiDeliveryStatsDto | null = null;
  loadingScores = true;
  loadingEpi = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getRowFactorsScores().subscribe({
      next: (data) => {
        this.rowFactorsScores = data;
        this.loadingScores = false;
      },
      error: (err) => {
        console.error('Error loading row factors scores', err);
        this.loadingScores = false;
      }
    });

    this.dashboardService.getEpiDeliveryStats().subscribe({
      next: (data) => {
        this.epiDeliveryStats = data;
        this.loadingEpi = false;
      },
      error: (err) => {
        console.error('Error loading epi delivery stats', err);
        this.loadingEpi = false;
      }
    });
  }
}
