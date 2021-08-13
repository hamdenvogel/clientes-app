import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { SistemaInfoFormComponent } from './sistema-info-form/sistema-info-form.component';


const routes: Routes = [
  { path: 'sistema-info', canActivate: [AuthGuard], component: LayoutComponent, children: [
    { path: 'form', component: SistemaInfoFormComponent },
    { path: '', redirectTo: '/sistema-info/form', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaInfoRoutingModule { }
