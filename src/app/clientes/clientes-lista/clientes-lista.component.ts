import { NotificationService } from './../../notification.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { Cliente } from '../cliente';
import { ClientesService } from '../../clientes.service';
import { TotalClientes } from '../totalClientes';


@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteSelecionado: Cliente;
  mensagemSucesso: string;
  mensagemErro: string;

  campoPesquisa: string = "";
  config: any;
  collection = { count: 0, data: [] };
  configCustomPagination: any;
  collectionCustomPagination = { count: 0, data: [] };
  collectionCopy = { count: 0, data: [] };
  maxSize: number = 7;
  labels: any = {
    previousLabel: '<-Anterior',
    nextLabel: 'Proxima-->',
    screenReaderPaginationLabel: 'Paginacao',
    screenReaderPageLabel: 'pagina',
    screenReaderCurrentLabel: `Voce esta na pagina`
  };
  totalClientes: TotalClientes;
  totalClientesCadastrados: number;

  constructor(
    private service: ClientesService,
    private router: Router,
    private notificationService: NotificationService) {
      this.totalClientes = new TotalClientes();
    }

  carregaClientes( pagina = 0, tamanho = 10){
      this.service
        .totalClientes()
        .subscribe(resposta => {
          this.totalClientes = resposta;
          this.totalClientesCadastrados = this.totalClientes.totalClientes;
          this.service.obterPesquisaPaginada(pagina,  this.totalClientesCadastrados)
          .subscribe(response => {
            this.clientes = response.content;
            this.collection.data = this.clientes;
            this.collection.count = response.totalElements;
            this.collectionCopy = {...this.collection};
            //this.pagina = response.number;
           })
        });
    }

  ngOnInit(): void {
   /* this.service
      .getClientes()
      .subscribe(resposta => this.clientes = resposta); */

    this.carregaClientes(0,10);

    this.collectionCustomPagination = this.collection;
    this.config = {
      id: 'basicPaginate',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.configCustomPagination = {
      id: 'customPaginate',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }

  pesquisarNome(){
    this.collectionCustomPagination = {...this.collectionCopy};
   /* var data2 =  this.collectionCustomPagination.data.filter(function(data) {
      return data.descricao == "teste XXX";
    }); */

    if ( this.campoPesquisa.trim() == "") {
      this.collectionCustomPagination = {...this.collectionCopy};
    }
    else {
      var dataPesquisa = this.collectionCustomPagination.data.filter
        (x => x.nome.toLowerCase().includes(this.campoPesquisa.toLowerCase()));
      this.collectionCustomPagination.data = dataPesquisa;
    }
  }

  onKeyUp(evento: KeyboardEvent){
    //console.log('onKeyUp ' + (<HTMLInputElement>evento.target).value);
    this.pesquisarNome();
  }

  onChange(event: any) {
    //console.log('onChange ' + event.target.value);
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  onPageChange(event) {
    this.configCustomPagination.currentPage = event;
  }

  novoCadastro(){
    this.router.navigate(['/clientes/form'])
  }

  preparaDelecao(cliente: Cliente){
    this.clienteSelecionado = cliente;
    console.log('preparaDelecao: ' + this.clienteSelecionado);
  }

  teste() {
    console.log('teste');
  }

  deletarCliente(){
    this.service
      .deletar(this.clienteSelecionado)
      .subscribe(
        response => {
          //this.mensagemSucesso = 'Cliente deletado com sucesso!'
          this.notificationService.showToasterSuccess('Cliente deletado com sucesso!');
          this.ngOnInit();
        },
        erro => {this.mensagemErro = 'Ocorreu um erro ao deletar o cliente.',
          this.notificationService.showToasterError(this.mensagemErro,
          'Erro')
        }

      )
  }
}
