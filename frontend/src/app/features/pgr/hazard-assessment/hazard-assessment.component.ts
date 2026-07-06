import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HazardCardComponent } from './components/hazard-card/hazard-card.component';
import { ApiService } from '../../../core/services/api.service';
import { HazardHeaderComponent } from './components/hazard-header/hazard-header.component';
import { HazardAssessmentsService } from '../services/hazard-assessments.service';
import IWorkUnitDto from '../../../core/http/dtos/IWorkUnitDto';
import { WorkUnitService } from '../services/work-unit.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-hazard-assessment',
  standalone: true,
  imports: [FormsModule, HazardCardComponent, HazardHeaderComponent, TranslatePipe],
  templateUrl: 'hazard-assessment.component.html',
  styleUrl: 'hazard-assessment.component.scss',
})
export class HazardAssessmentComponent implements OnInit {
  // Services
  private activatedRouter: ActivatedRoute = inject(ActivatedRoute);
  private apiService: ApiService = inject(ApiService);
  private assessmentsService: HazardAssessmentsService = inject(HazardAssessmentsService);
  private workUnitService: WorkUnitService = inject(WorkUnitService);

  // Properties
  workUnits!: IWorkUnitDto[];

  async ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params: Params) => {
      const assessmentId = params['assessmentId'];
      this.fetchData(assessmentId);
    });
  }

  async fetchData(assessmentId: string): Promise<void> {
    if (assessmentId) {
      try {
        const id = parseInt(assessmentId);
        this.apiService.getData<IWorkUnitDto[]>("pgr/work-unit/find-related-by-id", { id }).then((response) => {
          this.workUnits = response;
          if (!this.workUnits) return;
          const workUnit = this.workUnits.find(unit => unit.id === id) || null;
          if (!workUnit) return;
          this.workUnitService.setWorkUnitState(workUnit);
          const assessment = workUnit.hazardAssessments ? workUnit.hazardAssessments[0] : null;
          this.assessmentsService.setHazardAssessmentState(assessment);
        })
      } catch (err) { }
    } else {
      this.apiService.getData<IWorkUnitDto[]>("pgr/work-unit/find-last", {}).then(response => {
        this.workUnits = response;
        if (!this.workUnits) return;
        this.workUnitService.setWorkUnitState(this.workUnits[0])
        if (!this.workUnitService.workUnitHasState()) return;
        const lastAssessment = this.workUnits[0].hazardAssessments;
        if (lastAssessment) this.assessmentsService.setHazardAssessmentState(lastAssessment[0])
      })
    }
  }
}
