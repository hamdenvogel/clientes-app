import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PacoteRoutingModule } from './pacote-routing.module';
import { PacoteFormComponent } from './pacote-form/pacote-form.component';
import { PacoteListaComponent } from './pacote-lista/pacote-lista.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PacoteVisualizacaoComponent } from './pacote-visualizacao/pacote-visualizacao.component';


@NgModule({
  declarations: [
    PacoteFormComponent,
    PacoteListaComponent,
    PacoteVisualizacaoComponent
  ],
  imports: [
    CommonModule,
    PacoteRoutingModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    ModalModule.forRoot()
  ], exports: [
    PacoteFormComponent,
    PacoteListaComponent
  ]
})
export class PacoteModule { }
