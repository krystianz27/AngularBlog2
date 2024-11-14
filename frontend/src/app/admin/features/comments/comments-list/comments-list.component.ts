import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentService } from '../../../../core/services/comment.service';
import { IComment } from '../../../../core/interfaces/models/comment.mode.interface';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent {
  moment = moment;
  displayedColumns: string[] = [
    'select',
    'id',
    'content',
    'createdAt',
    'updatedAt',
  ];
  dataSource = new MatTableDataSource<IComment>([]);
  selection = new SelectionModel<IComment>(true, []);
  commentService = inject(CommentService);
  route = inject(ActivatedRoute);
  postId?: number;

  constructor() {
    this.route.params.subscribe((params) => {
      this.postId = parseInt(params['postId']);
      this.loadComments();
    });
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
  checkboxLabel(row?: IComment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  loadComments() {
    this.commentService.getComments(this.postId!).subscribe((comments) => {
      this.dataSource.data = comments;
    });
  }

  deleteSelectedComments() {
    const selectedComments = this.selection.selected;
    const selectedCommentIds = selectedComments.map((category) => category.id);
    const promises = selectedCommentIds.map((id) => {
      const ob = this.commentService.deleteComment(id);
      return lastValueFrom(ob);
    });
    Promise.all(promises).then(() => {
      this.loadComments();
      this.selection.clear();
    });
  }
}
