import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemPacoteRoutingModule } from './item-pacote-routing.module';
import { ItemPacoteListaComponent } from './item-pacote-lista/item-pacote-lista.component';


@NgModule({
  declarations: [ItemPacoteListaComponent],
  imports: [
    CommonModule,
    ItemPacoteRoutingModule
  ]
})
export class ItemPacoteModule { }
