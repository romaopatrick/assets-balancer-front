import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { GroupComponent } from './assets/group/group.component';

const routes: Routes = [
  {
    path: '',
    component: AssetsComponent
  },
  {
    path: 'group/:id',
    component: GroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
