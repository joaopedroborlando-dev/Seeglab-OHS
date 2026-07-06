import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import IHazardInventoryDto from '../../../core/http/dtos/IHazardInventoryDto';

/**
 * Service responsible for managing department inclusion assessment state
 * Provides methods to access, update and observe department assessment data, and current inventory
 */
@Injectable({
  providedIn: 'root'
})
export class HazardInventoryService {
  /**
   * BehaviorSubject that stores and emits the current hazard inventory state
   * @private
   */
  private _hazardInventorySubject: BehaviorSubject<IHazardInventoryDto | null> =
    new BehaviorSubject<IHazardInventoryDto | null>(null);

  /**
   * Observable that components can subscribe to for receiving hazard inventory updates
   * Using $ suffix as a convention to indicate this is an Observable
   */
  public hazardInventory$: Observable<IHazardInventoryDto | null> = this._hazardInventorySubject.asObservable();

  constructor() {}

  /**
   * Updates the hazard inventory state with a new value
   * @param value The new hazard inventory state
   */
  setHazardInventoryState(value: IHazardInventoryDto | null): void {
    this._hazardInventorySubject.next(value);
  }

  /**
   * Retrieves the current hazard inventory state value synchronously
   * @returns The current hazard inventory state or null if not set
   */
  getHazardInventoryState(): IHazardInventoryDto | null {
    return this._hazardInventorySubject.getValue();
  }

  /**
   * Resets the hazard inventory state to null
   */
  resetHazardInventoryState(): void {
    this._hazardInventorySubject.next(null);
  }

  /**
   * Updates specific properties of the hazard inventory state without replacing the entire object
   * Merges the provided partial state with the current state
   * @param partialState Object containing the properties to update
   * @throws Warning if attempting to update before state is initialized
   */
  updateHazardInventoryState(partialState: Partial<IHazardInventoryDto>): void {
    const currentState = this._hazardInventorySubject.getValue();
    if (currentState) {
      this._hazardInventorySubject.next({
        ...currentState,
        ...partialState
      });
    } else {
      console.warn('Attempted to update hazard inventory state before it was initialized');
    }
  }

  /**
   * Checks if the department assessment state has been initialized
   * @returns Boolean indicating whether the state has been initialized
   */
  hazardInventoryHasState(): boolean {
    return this._hazardInventorySubject.getValue() !== null;
  }
}
