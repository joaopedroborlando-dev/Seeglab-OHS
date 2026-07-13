import { Component, Input, Output, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface DropdownOption {
  id: string | number;
  name: string;
  [key: string]: any;
}

/**
 * @inputId Input: html id
 * @placeholder Input: html input placeholder
 * @options Input: DropdownOption array representing items to be displayed;
 * @isLoading Input: control loading display;
 * @disabled Input: input disable state;
 * @inputClass Input: custom input class;
 * @debounceTime Input: await that milliseconds to trigger another request;
 * @minSearchLength Input: minimum characters before triggering search;
 * @loadingText Input: text displayed when fetching data;
 * @noResultsText Input: text when no results found;
 * @emptyStateText Input;
 * @search Output: emitted when user searches (debounced);
 * @optionSelected Output: emitted when an option is selected;
 * @inputFocus Output: focus event;
 * @inputBlur Output: blur event;
 */
@Component({
  selector: 'app-dropdown-input',
  standalone: true,
  imports: [NgClass, TranslatePipe],
  template: `
    @if (label) {
      <label for="inputId" class="form-label">{{ label | translate }}</label>
    }
    <div class="dropdown-input-container position-relative">
      <input
        type="text"
        class="form-control"
        [id]="inputId"
        [placeholder]="placeholder | translate"
        [value]="displayValue"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeyDown($event)"
        [disabled]="disabled"
        [ngClass]="inputClass"
        autocomplete="off">
    
      <!-- Dropdown Menu -->
      <ul class="dropdown-menu w-100"
        [class.show]="showDropdown && (options.length > 0 || isLoading || showNoResults)">
    
        <!-- Loading state -->
        <!--        <li *ngIf="isLoading" class="dropdown-item-text text-muted">-->
        <!--          <div class="d-flex align-items-center">-->
        <!--            <div class="spinner-border spinner-border-sm me-2" role="status"></div>-->
        <!--            {{ loadingText | translate }}-->
      <!--          </div>-->
    <!--        </li>-->
    
    <!-- Options -->
    @for (option of options; track option.id; let i = $index) {
      <li
        class="dropdown-item"
        [class.active]="i === selectedIndex"
        (mousedown)="selectOption(option, i)"
        (mouseenter)="selectedIndex = i">
        {{ option.name }}
      </li>
    }
    
    <!-- No results -->
    @if (showNoResults) {
      <li class="dropdown-item-text text-muted">
        {{ noResultsText | translate }}
      </li>
    }
    
    <!-- Empty state when no search term -->
    @if (options.length === 0 && !isLoading && !searchTerm && emptyStateText) {
      <li
        class="dropdown-item-text text-muted">
        {{ emptyStateText | translate }}
      </li>
    }
    </ul>
    <div class="invalid-feedback">
      {{'REQUIRED_FIELD' | translate}}
    </div>
    </div>
    `,
  styleUrl: './dropdown-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownInputComponent),
      multi: true
    }
  ]
})
export class DropdownInputComponent implements ControlValueAccessor, OnDestroy {
  // Input properties
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() inputClass: string = '';
  @Input() debounceTime: number = 300;
  @Input() minSearchLength: number = 0;

  // Text customization
  @Input() loadingText: string = 'SEARCHING';
  @Input() noResultsText: string = 'NO_RESULTS_FOUND';
  @Input() emptyStateText: string = '';

  // Events
  @Output() search = new EventEmitter<string>();
  @Output() optionSelected = new EventEmitter<DropdownOption>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  // Internal state
  displayValue: string = '';
  searchTerm: string = '';
  showDropdown: boolean = false;
  selectedIndex: number = -1;

  // RxJS
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  // ControlValueAccessor
  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor() {
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.displayValue = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.displayValue = value;
    this.searchTerm = value;
    this.showDropdown = true;
    this.selectedIndex = -1;

    // Emit value change
    this.onChange(value);

    // Trigger search if meets minimum length requirement
    if (value.length >= this.minSearchLength) {
      this.searchSubject.next(value);
    } else if (value.length === 0) {
      this.searchSubject.next('');
    }
  }

  onFocus(): void {
    this.showDropdown = true;
    this.inputFocus.emit();

    // Trigger initial search if there's a value
    if (this.displayValue.length >= this.minSearchLength) {
      this.searchSubject.next(this.displayValue);
    } else {
      this.searchSubject.next('');
    }
  }

  onBlur(): void {
    // Delay hiding dropdown to allow click events on dropdown items
    setTimeout(() => {
      this.showDropdown = false;
      this.selectedIndex = -1;
      this.onTouched();
      this.inputBlur.emit();
    }, 150);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showDropdown) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.options.length - 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.options[this.selectedIndex]) {
          this.selectOption(this.options[this.selectedIndex], this.selectedIndex);
        }
        break;

      case 'Escape':
        this.showDropdown = false;
        this.selectedIndex = -1;
        break;
    }
  }

  selectOption(option: DropdownOption, index: number): void {
    this.displayValue = option.name;
    this.searchTerm = option.name;
    this.showDropdown = false;
    this.selectedIndex = -1;

    // Emit events
    this.onChange(option.name);
    this.optionSelected.emit(option);
  }

  // Computed properties
  get showNoResults(): boolean {
    return !this.isLoading &&
      this.options.length === 0 &&
      this.searchTerm.length > 0 &&
      this.searchTerm.length >= this.minSearchLength;
  }

  // Private methods
  private setupSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.search.emit(searchTerm);
      });
  }
}
