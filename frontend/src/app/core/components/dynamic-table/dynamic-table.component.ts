import { Component, EventEmitter, Input, Output } from '@angular/core';
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
            @if(data && data.header.length > 0){
              @for(item of data.header; track item) {
                <th scope="col">{{item | translate}}</th>
              }
              @if(canEdit || canDelete) {
                <th scope="col">{{"ACTIONS" | translate}}</th>
              }
            }
          </tr>
        </thead>
        <tbody>
          @if(data && data.data.length > 0){
            @for(row of data.data; let rowIndex = $index; track rowIndex) {
              <tr>
                @if(row.rowData.length > 0){
                  @for(itemRow of row.rowData; let idx2 = $index; track itemRow.key){
                    <td>{{itemRow.value}}</td>
                  }
                  @if(canEdit || canDelete) {
                    <td class="button-cell" style="width:1px; white-space:nowrap; align-items: center">
                      @if(canEdit) {
                        <button type="button" class="btn btn-secondary" (click)="onEdit.emit(row.rowId)" title="{{ 'EDIT' | translate }}">
                          <i class="bi bi-pencil-fill"></i>
                        </button>
                      }
                     @if(canDelete) {
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
  `,
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {
  @Input() data!: IDynamicTableData;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<string>();
}
