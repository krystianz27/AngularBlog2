import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/posts/posts.module').then((m) => m.PostsModule),
      },
      {
        path: 'tags',
        loadChildren: () =>
          import('./features/tags/tags.module').then((m) => m.TagsModule),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.module').then((m) => m.AboutModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
