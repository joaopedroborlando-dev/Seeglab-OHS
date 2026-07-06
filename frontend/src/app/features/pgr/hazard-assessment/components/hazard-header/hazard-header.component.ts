import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CarouselComponent } from '../../../../../core/components/carousel/carousel.component';

import IHazardAssessmentDto from '../../../../../core/http/dtos/IHazardAssessmentDto';
import IWorkUnitDto from '../../../../../core/http/dtos/IWorkUnitDto';
import { HazardCarouselCardComponent } from '../hazard-carousel-card/hazard-carousel-card.component';
import IHazardDto from '../../../../../core/http/dtos/IHazardDto';
import { WorkUnitService } from '../../../services/work-unit.service';
import { ApiService } from '../../../../../core/services/api.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { HazardAssessmentsService } from '../../../services/hazard-assessments.service';

@Component({
  selector: 'app-hazard-header',
  imports: [
    CarouselComponent,
    HazardCarouselCardComponent
  ],
  templateUrl: './hazard-header.component.html',
  styleUrl: './hazard-header.component.scss'
})
export class HazardHeaderComponent implements OnInit, OnDestroy {
  workUnitService: WorkUnitService = inject(WorkUnitService);
  assessmentService: HazardAssessmentsService = inject(HazardAssessmentsService);
  apiService: ApiService = inject(ApiService);
  toastService: ToastService = inject(ToastService);

  @Input() workUnits!: IWorkUnitDto[];
  @Input() assessments!: IHazardAssessmentDto[];

  ngOnDestroy(): void { }

  ngOnInit(): void { }

  addHazard(event: IHazardDto): void {
    if (!this.workUnitService.workUnitHasState()) return;
    const hazardAlreadyAdded = this.workUnitService.getWorkUnitState()?.hazardAssessments?.some(assessment => assessment.hazard.id === event.id)
    if (hazardAlreadyAdded) {
      this.toastService.warning("HAZARD_ALREADY_BEEN_ADDED");
      return;
    }
    const hazardAssessment: IHazardAssessmentDto = {
      hazard: event,
      workUnitId: this.workUnitService.getWorkUnitState()?.id
    }
    this.apiService.postData<IHazardAssessmentDto>("pgr/assessment/create", hazardAssessment).then(res => {
      const data = res;
      const assessments = this.workUnitService.getWorkUnitState()?.hazardAssessments || [];
      assessments.push(data);
      this.workUnitService.updateWorkUnitState({
        hazardAssessments: assessments
      })
      this.assessmentService.setHazardAssessmentState(data)
    }).catch(err => {
      this.toastService.error("FAILED_TO_SAVE");
      console.log(err.message);
    })
  }

  onWorkUnitChange(event: IWorkUnitDto): void {
    this.workUnitService.setWorkUnitState(event);
    this.assessmentService.setHazardAssessmentState(event.hazardAssessments && event.hazardAssessments.length
      ? event.hazardAssessments[0]
      : null
    )
  }

}
