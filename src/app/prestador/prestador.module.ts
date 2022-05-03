import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PrestadorRoutingModule } from './prestador-routing.module';
import { PrestadorFormComponent } from './prestador-form/prestador-form.component';
import { PrestadorListaComponent } from './prestador-lista/prestador-lista.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

@NgModule({
  declarations: [
    PrestadorFormComponent,
    PrestadorListaComponent
  ],
  imports: [
    CommonModule,
    PrestadorRoutingModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
  ], exports: [
    PrestadorFormComponent,
    PrestadorListaComponent
  ]
})
export class PrestadorModule { }
