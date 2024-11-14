import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import moment from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { PostService } from '../../../../core/services/post.service';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent {
  moment = moment;
  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'totalComments',
    'categoryId',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<IPost>([]);
  selection = new SelectionModel<IPost>(true, []);
  postService = inject(PostService);

  constructor() {
    this.loadPosts();
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
  checkboxLabel(row?: IPost): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }

  loadPosts() {
    this.postService.getPosts({}).subscribe((tags) => {
      this.dataSource.data = tags;
    });
  }

  deleteSelectedPosts() {
    const selectedTags = this.selection.selected;
    const selectedCategoryIds = selectedTags.map((category) => category.id);
    const promises = selectedCategoryIds.map((id) => {
      const ob = this.postService.deletePost(id);
      // convert into promise
      return lastValueFrom(ob);
    });

    Promise.all(promises).then(() => {
      this.loadPosts();
    });
  }
}
