import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgClass
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  template: `
    <div class="dropdown-input-container position-relative">
      
      <div class="input-group">
        @if(labelText) {
          <label [for]="inputId" class="input-group-text">{{ labelText | translate }}</label>
        }
        
        <input
          class="form-control"
          type="text"
          [id]="inputId"
          [placeholder]="placeholder | translate"
          [formControl]="control"
          (focus)="onFocus()"
          (blur)="onBlur()"
          autocomplete="off"
        >

        @if(showBindButton){
          <button
            class="btn btn-outline-secondary"
            type="button"
            (click)="onBindClick()"
            [disabled]="btnDisabled"
          >
            <i [class]="iconName"></i>
          </button>
        }
      </div>

      <ul class="dropdown-menu w-100" 
          [class.show]="showDropdown && items.length > 0">
        
        @for(item of items; track getItemLabel(item)) {
          <li class="dropdown-item" 
              (mousedown)="selectItem(item)">
            {{ getItemLabel(item) }}
          </li>
        }

        @if(showDropdown && items.length === 0 && control.value) {
          <li class="dropdown-item-text text-muted">
            {{ 'NO_RESULTS' | translate }}
          </li>
        }
      </ul>

    </div>
  `,
  styleUrl: './searchable-dropdown.component.scss'
})
export class SearchableDropdownComponent implements OnInit, OnDestroy {
  @Input() inputId = 'search-dropdown';
  @Input() listId = '';
  @Input() labelText = '';
  @Input() placeholder = '';
  @Input() iconName = 'bi bi-search';
  @Input() btnDisabled: boolean = false;
  @Input() items: any[] = [];
  @Input() control!: FormControl;
  @Input() showBindButton = false;
  @Input() labelKey = 'name';
  @Input() valueKey = 'id';

  @Output() search = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() bindClick = new EventEmitter<void>();

  showDropdown = false;
  private destroy$ = new Subject<void>();
  selectedItem = false;

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      console.log(value);
      if (this.control.disabled || value == null || value === '') {
        return;
      }
      if (this.selectedItem) {
        this.selectedItem = false;
        return;
      }
      this.showDropdown = true;
      if (typeof value === 'string') {
        this.search.emit(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFocus(): void {
    this.showDropdown = true;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

  selectItem(item: any): void {
    this.selectionChange.emit(item);
    this.showDropdown = false;
    this.selectedItem = true;
  }

  onBindClick(): void {
    this.bindClick.emit();
  }

  getItemLabel(item: any): string {
    if (!item) return '';
    return item[this.labelKey] || '';
  }
}