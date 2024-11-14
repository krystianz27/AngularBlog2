import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
})
export class TagsListComponent {
  moment = moment;
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<ITag>([]);
  selection = new SelectionModel<ITag>(true, []);
  tagService = inject(TagService);

  constructor() {
    this.loadTags();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ITag): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  loadTags() {
    this.tagService.getTags().subscribe((tags) => {
      this.dataSource.data = tags;
    });
  }

  deleteSelectedTags() {
    const selectedTags = this.selection.selected;
    const selectedTagIds = selectedTags.map((category) => category.id);
    const promises = selectedTagIds.map((id) => {
      const ob = this.tagService.deleteTag(id);
      return lastValueFrom(ob);
    });
    Promise.all(promises).then(() => {
      this.loadTags();
      this.selection.clear();
    });
  }
}
