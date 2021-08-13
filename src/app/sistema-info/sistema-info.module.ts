import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaInfoRoutingModule } from './sistema-info-routing.module';
import { SistemaInfoFormComponent } from './sistema-info-form/sistema-info-form.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [SistemaInfoFormComponent],
  imports: [
    CommonModule,
    SistemaInfoRoutingModule,
    FormsModule
  ], exports: [
    SistemaInfoFormComponent
  ]
})
export class SistemaInfoModule { }
