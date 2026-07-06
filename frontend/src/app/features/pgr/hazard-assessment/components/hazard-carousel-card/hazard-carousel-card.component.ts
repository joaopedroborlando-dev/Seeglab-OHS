import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

import { TranslatePipe } from "@ngx-translate/core";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api.service';
import IHazardDto from '../../../../../core/http/dtos/IHazardDto';

@Component({
  selector: 'app-hazard-carousel-card',
  imports: [
    TranslatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './hazard-carousel-card.component.html',
  styleUrl: './hazard-carousel-card.component.scss'
})
export class HazardCarouselCardComponent implements OnInit {
  private apiService = inject(ApiService);

  hazards: IHazardDto[] = [];
  hazardControl = new FormControl('');

  @Input() content!: any;

  @Output() onAddHazard = new EventEmitter();

  addHazard() {
    this.onAddHazard.emit(this.hazards.find(el => el.description == this.hazardControl.value));
    this.hazardControl.reset();
  }

  ngOnInit(): void {
    this.apiService.getData<IHazardDto[]>("pgr/hazard/find-all", {}).then((response) => {
      this.hazards = response;
    })
  }

}
