import {
  ChangeDetectionStrategy,
  Component, computed, effect,
  input,
  OnInit, output, signal,
  TemplateRef, untracked
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

/**
 * @usage
 * <app-carousel [items]="yourItemArray" [optionTemplate]="yourTemplateRef"></app-carousel>
 *
 * @param T The type of items in the carousel.
 * @property optionTemplate - A custom template for rendering each carousel item.
 * @property items - The array of data to be displayed in the carousel.
 * @property itemChange - Emits the currently active item whenever it changes.
 */
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgTemplateOutlet],
  styles: [`
    .nav-container {
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
    }
    /* Custom styles for the visibility toggle icon transition */
    .toggle-icon {
      width: 1em;
      height: 1em;
      transition: transform 0.2s ease-in-out;
    }
    .toggle-icon.rotated {
      transform: rotate(-180deg);
    }

    /* Ensure buttons in pagination list items don't have extra styling */
    .pagination .page-item .page-link {
        border-radius: 0.25rem; /* Add back border-radius for individual buttons */
        margin: 0 2px;
    }
    .pagination .page-item:first-child .page-link,
    .pagination .page-item:last-child .page-link {
        margin: 0;
    }
  `],
  template: `
    <!-- Main container for the carousel, using Bootstrap's container for responsive width -->
    <div class="nav-container">
      <!-- Navigation and Controls Row -->
      @if (items().length > 1) {
        <div class="d-flex justify-content-start align-items-center mb-3">

          <!-- Visibility Toggle Button -->
          <button
            (click)="toggleContentVisibility()"
            class="btn btn-sm btn-secondary d-flex align-items-center"
            style="margin-right: 0.5rem"
          >
            <span>{{ isContentVisible() ? 'Hide' : 'Show' }}</span>
          </button>

          <!-- Pagination Controls using Bootstrap's pagination component -->
          <nav aria-label="Carousel navigation">
            <ul class="pagination pagination-sm m-0">
              <!-- Previous Button -->
              <li class="page-item" [class.disabled]="!canGoPrevious()">
                <button class="page-link" (click)="goToPrevious()">Prev</button>
              </li>

              <!-- Page Numbers -->
              @for (page of paginationNumbers(); track page) {
                <li class="page-item" [class.active]="(page - 1) === currentIndex()">
                  <button class="page-link" (click)="goToIndex(page - 1)">
                    {{ page }}
                  </button>
                </li>
              }

              <!-- Next Button -->
              <li class="page-item" [class.disabled]="!canGoNext()">
                <button class="page-link" (click)="goToNext()">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      }

      <!-- Carousel Content Area -->
      @if (isContentVisible() && currentItem()) {
        <div  style="min-height: 150px;">
          <!-- Template outlet for the current item -->
          <ng-container
            [ngTemplateOutlet]="optionTemplate() || defaultTemplate"
            [ngTemplateOutletContext]="{ $implicit: currentItem(), index: currentIndex() }">
          </ng-container>
        </div>
      } @else if(isContentVisible() && items().length === 0) {
        <div class="text-center text-muted py-5">
            No items to display.
        </div>
      }

      <!-- Default Template: Used if no custom template is provided -->
      <ng-template #defaultTemplate let-content>
        <div class="text-center">
          <h3 class="fw-semibold">{{ content?.title || 'Default Title' }}</h3>
          <p class="mt-2 text-muted">{{ content?.textBody || 'Default body text for the carousel item.' }}</p>
        </div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent<T> implements OnInit {
  // --- INPUTS ---
  /** A custom template to render each carousel item. */
  optionTemplate = input<TemplateRef<any>>();
  /** The array of data items for the carousel. */
  items = input.required<T[]>();

  // --- OUTPUTS ---
  /** Emits the currently active item when it changes. */
  itemChange = output<T>();

  // --- STATE SIGNALS ---
  /** The index of the currently displayed item. */
  currentIndex = signal(0);
  /** Toggles the visibility of the carousel's main content area. */
  isContentVisible = signal(true);

  // --- DERIVED COMPUTED SIGNALS ---
  /** The current item object based on the currentIndex. */
  currentItem = computed(() => this.items()?.[this.currentIndex()]);
  /** Determines if the "Previous" button should be enabled. */
  canGoPrevious = computed(() => this.currentIndex() > 0);
  /** Determines if the "Next" button should be enabled. */
  canGoNext = computed(() => this.currentIndex() < this.items().length - 1);

  /**
   * Calculates the page numbers to display in the pagination.
   * Shows a maximum of 3 page numbers centered around the current page.
   */
  paginationNumbers = computed(() => {
    const totalItems = this.items().length;
    const currentIdx = this.currentIndex();

    if (totalItems <= 3) {
      return Array.from({ length: totalItems }, (_, i) => i + 1);
    }

    if (currentIdx === 0) {
      return [1, 2, 3];
    }

    if (currentIdx === totalItems - 1) {
      return [totalItems - 2, totalItems - 1, totalItems];
    }

    return [currentIdx, currentIdx + 1, currentIdx + 2];
  });

  constructor() {
    // Effect to emit the new item when the current one changes
    effect(() => {
      const current = this.currentItem();
      if (current) {
        // Use untracked to prevent infinite loops if the parent component
        // updates the items array in response to the event.
        untracked(() => this.itemChange.emit(current));
      }
    });
  }

  ngOnInit(): void {
    // Emit the initial item when the component loads
    if (this.items().length > 0) {
      this.itemChange.emit(this.items()[0]);
    }
  }

  // --- PUBLIC METHODS ---

  /** Navigates to the previous item in the carousel. */
  goToPrevious(): void {
    if (this.canGoPrevious()) {
      this.currentIndex.update(i => i - 1);
    }
  }

  /** Navigates to the next item in the carousel. */
  goToNext(): void {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
    }
  }

  /** Navigates to a specific item by its index. */
  goToIndex(index: number): void {
    if (index >= 0 && index < this.items().length) {
      this.currentIndex.set(index);
    }
  }

  /** Toggles the visibility of the carousel content. */
  toggleContentVisibility(): void {
    this.isContentVisible.update(v => !v);
  }
}
