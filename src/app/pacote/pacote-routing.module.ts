import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import { PacoteFormComponent } from './pacote-form/pacote-form.component';
import { PacoteListaComponent } from './pacote-lista/pacote-lista.component';

const routes: Routes = [
  { path: 'pacote', canActivate: [AuthGuard], component: LayoutComponent, children: [
    { path: 'form', component: PacoteFormComponent },
    { path: 'form/:id', component: PacoteFormComponent },
    { path: 'lista', component: PacoteListaComponent },
    { path: 'remover/', component: PacoteListaComponent },
    { path: 'remover/:id', component: PacoteListaComponent },
    { path: '', redirectTo: '/pacote/lista', pathMatch: 'full' },
    { path: '**', component: PacoteListaComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacoteRoutingModule { }
