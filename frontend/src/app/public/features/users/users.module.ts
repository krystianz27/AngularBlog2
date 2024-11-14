import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    UsersRoutingModule,
    UserDetailComponent,
  ],
})
export class UsersModule {}
