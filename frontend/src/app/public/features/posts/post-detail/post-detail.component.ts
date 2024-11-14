import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment, { Moment } from 'moment';
import { IPostTag } from '../../../../core/interfaces/models/post-tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';
import { IComment } from '../../../../core/interfaces/models/comment.mode.interface';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  moment: Moment = moment();

  route = inject(ActivatedRoute);
  tagService = inject(TagService);
  postService = inject(PostService);
  commentService = inject(CommentService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    content: [''],
  });

  post?: IPost;
  postTags: IPostTag[] = [];
  comments: IComment[] = [];

  constructor() {
    this.route.params.subscribe((params) => {
      this.loadPost(params['slug']);
    });
  }

  loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe((data) => {
      this.post = data;

      this.loadTags();
      this.loadComments();
    });
  }

  loadTags() {
    if (this.post) {
      this.tagService.getPostTags(this.post.id).subscribe((data) => {
        this.postTags = data;
      });
    }
  }

  loadComments() {
    if (this.post) {
      this.commentService.getComments(this.post.id).subscribe((data) => {
        this.comments = data;
      });
    }
  }

  submitComment() {
    this.commentService
      .createComment(this.form.value.content!, this.post!.id)
      .subscribe({
        next: () => {
          this.loadComments();
          this.form.reset();
        },
        error: (error) => {
          if (error && error.error && error.error.message) {
            alert(error.error.message);
          }
          console.error(error);
        },
      });
  }

  getFormattedDate(date: string): string {
    return moment(date).fromNow();
  }
}
