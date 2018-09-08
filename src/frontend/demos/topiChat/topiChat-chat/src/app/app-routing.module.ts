import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  // default route
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
];

@NgModule({
  exports: [
    // makes router directives available for use in
    // other components that will need them
    RouterModule
  ],
  imports: [
    // initialize RouterModule with routes
    RouterModule.forRoot(routes)
  ]
})

export class AppRoutingModule { }