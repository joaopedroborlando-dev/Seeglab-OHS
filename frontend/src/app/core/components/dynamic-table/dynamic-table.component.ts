import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import IDynamicTableData from '../../models/interfaces/IDynamicTableData';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="table-responsive">
      <table class="table table-striped table-fit">
        <thead>
          <tr>
            @if(data() && data().header.length > 0){
              @for(item of data().header; track item) {
                <th scope="col">{{item | translate}}</th>
              }
              @if(canEdit() || canDelete()) {
                <th scope="col">{{"ACTIONS" | translate}}</th>
              }
            }
          </tr>
        </thead>
        <tbody>
          @if(data() && data().data.length > 0){
            @for(row of data().data; let rowIndex = $index; track rowIndex) {
              <tr>
                @if(row.rowData.length > 0){
                  @for(itemRow of row.rowData; let idx2 = $index; track itemRow.key){
                    <td [attr.data-label]="data().header[idx2] | translate">{{itemRow.value}}</td>
                  }
                  @if(canEdit() || canDelete()) {
                    <td class="button-cell" [attr.data-label]="'ACTIONS' | translate">
                      @if(canEdit()) {
                        <button type="button" class="btn btn-secondary" (click)="onEdit.emit(row.rowId)" title="{{ 'EDIT' | translate }}">
                          <i class="bi bi-pencil-fill"></i>
                        </button>
                      }
                      @if(canDelete()) {
                        <button type="button" class="btn btn-secondary" style="margin-left: 5px" (click)="onDelete.emit(row.rowId)" title="{{ 'DELETE' | translate }}">
                          <i class="bi bi-trash-fill"></i>
                        </button>
                      }
                    </td>
                  }
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
    <!-- Bootstrap Pagination -->
      @if (totalPages() > 0) {
      <nav aria-label="Department pagination">
        <ul class="pagination">
          <!-- Previous button -->
          <li class="page-item" [class.disabled]="currentPage() === 1">
            <a class="page-link" href="javascript:void(0)" (click)="previousPage()" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <!-- Page numbers -->
          @for (page of getPageNumbers(); track page) {
          <li class="page-item" [class.active]="page === currentPage()">
            <a class="page-link" href="javascript:void(0)" (click)="goToPage(page)">{{ page }}</a>
          </li>
          }
          <!-- Next button -->
          <li class="page-item" [class.disabled]="currentPage() === totalPages()">
            <a class="page-link" href="javascript:void(0)" (click)="nextPage()" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
      }

      <!-- Pagination info -->
      @if (totalItems() > 0) {
      <div class="text-muted small mt-2">
        {{ 'SHOWING' | translate }} {{ (currentPage() - 1) * pageSize() + 1 }} - {{ getSize() }} {{ 'OF' | translate }} {{ totalItems() }} {{ 'ENTRIES' | translate }}
      </div>
      }
  `,
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {
  data = input.required<IDynamicTableData>();
  canEdit = input<boolean>(false);
  canDelete = input<boolean>(false);
  totalPages = input<number>(0);
  totalItems = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);

  onDelete = output<string>();
  onEdit = output<string>();
  onPageChange = output<number>();

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.onPageChange.emit(page);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const totalPagesValue = this.totalPages();
    const currentPageValue = this.currentPage();

    if (totalPagesValue <= maxPagesToShow) {
      for (let i = 1; i <= totalPagesValue; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPageValue - 2);
      let endPage = Math.min(totalPagesValue, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  getSize(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalItems());
  }
}
