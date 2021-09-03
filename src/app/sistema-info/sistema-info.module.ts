import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaInfoRoutingModule } from './sistema-info-routing.module';
import { SistemaInfoFormComponent } from './sistema-info-form/sistema-info-form.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [SistemaInfoFormComponent],
  imports: [
    CommonModule,
    SistemaInfoRoutingModule,
    FormsModule,
    CarouselModule.forRoot()
  ], exports: [
    SistemaInfoFormComponent
  ]
})
export class SistemaInfoModule { }
