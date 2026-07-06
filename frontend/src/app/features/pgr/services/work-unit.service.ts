import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import IWorkUnitDto from '../../../core/http/dtos/IWorkUnitDto';

/**
 * Service responsible for managing work unit state
 * Provides methods to access, update and observe work unit data
 */
@Injectable({
  providedIn: 'root'
})
export class WorkUnitService {

  /**
   * BehaviorSubject that stores and emits the current work unit state
   * @private
   */
  private _workUnitSubject: BehaviorSubject<IWorkUnitDto | null> =
    new BehaviorSubject<IWorkUnitDto | null>(null);

  /**
   * Observable that components can subscribe to for receiving work unit updates
   * Using $ suffix as a convention to indicate this is an Observable
   */
  public workUnit$: Observable<IWorkUnitDto | null> = this._workUnitSubject.asObservable();

  constructor() {}

  /**
   * Updates the work unit state with a new value
   * @param value The new work unit state
   */
  setWorkUnitState(value: IWorkUnitDto | null): void {
    this._workUnitSubject.next(value);
  }

  /**
   * Retrieves the current work unit state value synchronously
   * @returns The current work unit state or null if not set
   */
  getWorkUnitState(): IWorkUnitDto | null {
    return this._workUnitSubject.getValue();
  }

  /**
   * Resets the work unit state to null
   */
  resetWorkUnitState(): void {
    this._workUnitSubject.next(null);
  }

  /**
   * Updates specific properties of the work unit state without replacing the entire object
   * Merges the provided partial state with the current state
   * @param partialState Object containing the properties to update
   * @throws Warning if attempting to update before state is initialized
   */
  updateWorkUnitState(partialState: Partial<IWorkUnitDto>): void {
    const currentState = this._workUnitSubject.getValue();
    if (currentState) {
      this._workUnitSubject.next({
        ...currentState,
        ...partialState
      });
    } else {
      console.warn('Attempted to update work unit state before it was initialized');
    }
  }

  /**
   * Checks if the department assessment state has been initialized
   * @returns Boolean indicating whether the state has been initialized
   */
  workUnitHasState(): boolean {
    return this._workUnitSubject.getValue() !== null;
  }

}
