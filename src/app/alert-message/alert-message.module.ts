import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { AlertMessageFormComponent } from '../alert-message-form/alert-message-form.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
    AlertMessageFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AlertModule
  ], exports : [
    AlertMessageFormComponent
  ]
})
export class AlertMessageModule { }
