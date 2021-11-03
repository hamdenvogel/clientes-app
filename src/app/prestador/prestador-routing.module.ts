import { PrestadorListaComponent } from './prestador-lista/prestador-lista.component';
import { PrestadorFormComponent } from './prestador-form/prestador-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  { path: 'prestador', canActivate: [AuthGuard], component: LayoutComponent, children: [
    { path: 'form', component: PrestadorFormComponent },
    { path: 'form/:id', component: PrestadorFormComponent },
    { path: 'lista', component: PrestadorListaComponent },
    { path: 'remover/', component: PrestadorListaComponent },
    { path: 'remover/:id', component: PrestadorListaComponent },
    { path: '', redirectTo: '/prestador/lista', pathMatch: 'full' },
    { path: '**', component: PrestadorListaComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestadorRoutingModule { }
