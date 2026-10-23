import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { BoxListComponent } from './box-list.component';

describe('BoxListComponent', () => {
  let component: BoxListComponent;
  let fixture: ComponentFixture<BoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxListComponent],
      providers: [provideTranslateService()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
