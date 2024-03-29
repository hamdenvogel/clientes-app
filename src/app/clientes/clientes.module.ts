import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { ClientesListaComponent } from './clientes-lista/clientes-lista.component';
import { ClientesRemoverComponent } from './clientes-remover/clientes-remover.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertMessageModule } from '../alert-message/alert-message.module';

@NgModule({
  declarations: [
    ClientesFormComponent,
    ClientesListaComponent,
    ClientesRemoverComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FormsModule,
    NgxPaginationModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ModalModule.forRoot(),
    AlertMessageModule

  ], exports: [
    ClientesFormComponent,
    ClientesListaComponent,
    ClientesRemoverComponent
  ]
})
export class ClientesModule { }
