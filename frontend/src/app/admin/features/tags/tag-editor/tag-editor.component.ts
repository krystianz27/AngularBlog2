import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '../../../../core/services/tag.service';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';

@Component({
  selector: 'app-tag-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss',
})
export class TagEditorComponent {
  fb = inject(FormBuilder);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  tag: ITag | undefined;

  form = this.fb.group({
    name: ['', Validators.required],
    id: [''],
  });

  constructor() {
    this.route.params.subscribe((data) => {
      const slug = data['slug'];

      if (slug) {
        this.tagService.getTag(slug).subscribe((tag) => {
          this.tag = tag;
          this.form.patchValue({
            id: this.tag.id + '',
            name: tag.name,
          });
          this.form.updateValueAndValidity();
        });
      }
    });
  }

  create() {
    if (this.form.invalid) return;

    this.tagService.addTag(this.form.value.name!).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin/tags']);
    });
  }

  update() {
    if (this.form.invalid) return;

    this.tagService
      .updateTag({
        id: parseInt(this.form.value.id!),
        name: this.form.value.name!,
      })
      .subscribe(() => {
        this.form.reset();
        this.router.navigate(['/admin/tags']);
      });
  }
}
