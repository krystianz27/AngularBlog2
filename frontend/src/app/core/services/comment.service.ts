import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IComment } from '../interfaces/models/comment.mode.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl = environment.BACKEND_API_URL + '/api/comments';
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  constructor() {}

  getCommentsByPostId(postId: number) {
    return this.httpClient.get<IComment[]>(`${this.baseUrl}/${postId}`);
  }

  createComment(content: string, postId: number) {
    console.log(content, postId);
    console.log(this.authService.session?.accessToken);
    return this.httpClient.post<IComment>(`${this.baseUrl}`, {
      content,
      postId,
    });
  }
}
