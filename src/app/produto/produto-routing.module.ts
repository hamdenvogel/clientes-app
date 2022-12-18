import { ProdutoListaComponent } from './produto-lista/produto-lista.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  { path: 'produto', canActivate: [AuthGuard], component: LayoutComponent, children: [
    { path: 'form', component: ProdutoFormComponent },
    { path: 'form/:id', component: ProdutoFormComponent },
    { path: 'lista', component: ProdutoListaComponent },
    { path: 'remover/', component: ProdutoListaComponent },
    { path: 'remover/:id', component: ProdutoListaComponent },
    { path: '', redirectTo: '/produto/lista', pathMatch: 'full' },
    { path: '**', component: ProdutoListaComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { }
