import { Injectable } from '@angular/core';
import IHazardAssessmentDto from '../../../core/http/dtos/IHazardAssessmentDto';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HazardAssessmentsService {

  /**
   * BehaviorSubject that stores and emits the current hazard assessments state
   * @private
   */
  private _assessmentsSubject: BehaviorSubject<IHazardAssessmentDto|null> =
    new BehaviorSubject<IHazardAssessmentDto | null >(null);

  /**
   * Observable that components can subscribe to for receiving hazard assessments updates
   * Using $ suffix as a convention to indicate this is an Observable
   */
  public assessments$: Observable<IHazardAssessmentDto | null> = this._assessmentsSubject.asObservable();

  constructor() { }

  /**
   * Updates the hazard assessments state with a new value
   * @param value The new hazard assessments state
   */
  setHazardAssessmentState(value: IHazardAssessmentDto | null): void {
    this._assessmentsSubject.next(value);
  }

  /**
   * Retrieves the current hazard assessments state value synchronously
   * @returns The current hazard assessments state or null if not set
   */
  getHazardAssessmentsState(): IHazardAssessmentDto | null {
    return this._assessmentsSubject.getValue();
  }

  /**
   * Resets the hazard assessments state to null
   */
  resetHazardAssessmentsState(): void {
    this._assessmentsSubject.next(null);
  }

  /**
   * Updates specific properties of the hazard assessments state without replacing the entire object
   * Merges the provided partial state with the current state
   * @param partialState Object containing the properties to update
   * @throws Warning if attempting to update before state is initialized
   */
  updateHazardAssessmentsState(partialState: Partial<IHazardAssessmentDto>): void {
    const currentState = this._assessmentsSubject.getValue();
    if (currentState) {
      this._assessmentsSubject.next({
        ...currentState,
        ...partialState
      });
    } else {
      console.warn('Attempted to update hazard assessments state before it was initialized');
    }
  }

  /**
   * Checks if the department assessment state has been initialized
   * @returns Boolean indicating whether the state has been initialized
   */
  hazardAssessmentsHasState(): boolean {
    return this._assessmentsSubject.getValue() !== null;
  }
}
