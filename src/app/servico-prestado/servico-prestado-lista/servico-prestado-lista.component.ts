import { Component, OnInit } from '@angular/core';
import { ServicoPrestadoBusca } from './servicoPrestadoBusca';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { NotificationService } from './../../notification.service';

@Component({
  selector: 'app-servico-prestado-lista',
  templateUrl: './servico-prestado-lista.component.html',
  styleUrls: ['./servico-prestado-lista.component.css']
})
export class ServicoPrestadoListaComponent implements OnInit {

  nome: string;
  mes: number;
  meses: number[];
  lista: ServicoPrestadoBusca[];
  message: string;

  constructor(
    private service: ServicoPrestadoService,
    private notificationService: NotificationService
  ) {
    this.meses = [1,2,3,4,5,6,7,8,9,10,11,12];
  }

  ngOnInit(): void {
  }

  consultar(){
    this.service
      .buscar(this.nome, this.mes)
      .subscribe(response => {
         this.lista = response;
        console.log('this.lista ' + this.lista);
        if( this.lista.length <= 0 ){
          this.message = "Nenhum Registro encontrado.";
          this.notificationService.showToasterInfo(this.message, "Informação");
        }else{
          this.message = null;
        }
      });
  }
}
