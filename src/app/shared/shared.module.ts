import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone-pipe/phone.pipe';
import OnlyNumbersDirective from './only-numbers/only-numbers.directive';


@NgModule({
  declarations: [
    PhonePipe,
    OnlyNumbersDirective
  ],
  imports: [
    CommonModule
  ], exports: [
    PhonePipe,
    OnlyNumbersDirective
  ]
})
export class SharedModule { }
