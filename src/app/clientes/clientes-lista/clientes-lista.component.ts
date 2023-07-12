import { NotificationService } from './../../notification.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { Cliente } from '../cliente';
import { ClientesService } from '../../clientes.service';
import { TotalClientes } from '../totalClientes';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { Constants } from 'src/app/shared/constants';
import { Alert } from 'src/app/alert';
import { OrderFields } from 'src/app/order-fields';


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
    nextLabel: 'Pr�xima-->',
    screenReaderPaginationLabel: 'Pagina��o',
    screenReaderPageLabel: 'p�gina',
    screenReaderCurrentLabel: `Voce est� na p�gina`
  };
  totalClientes: TotalClientes;
  totalClientesCadastrados: number;
  modalRef?: BsModalRef;
  TimeOut = Constants.TIMEOUT2;
  listAlerts: Alert[] = [];
  headers: any;
  orderFields: OrderFields[] = [];
  imgAsc = "../assets/arrow-asc.png";
  imgDesc = "../assets/arrow-desc.png";

  constructor(
    private service: ClientesService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: BsModalService) {
      this.totalClientes = new TotalClientes();
    }

  carregaClientes( pagina = 0){
      this.service
        .totalClientes()
        .subscribe(resposta => {
          this.totalClientes = resposta;
          this.totalClientesCadastrados = (this.totalClientes.totalClientes == 0) ? 1 : this.totalClientes.totalClientes;
          this.service.obterPesquisaPaginada(pagina,  this.totalClientesCadastrados, this.campoPesquisa.trim())
          .subscribe(response => {
            this.clientes = response.content;
            this.collection.data = this.clientes;
            this.collection.count = response.totalElements;
            this.collectionCopy = {...this.collection};
            //this.pagina = response.number;
           }).add(() => {
            for (let i = 0; i < this.collectionCopy.data.length; i++) {
              let dataCadastro = this.collectionCopy.data[i].dataCadastro;
              window.console.log('dataCadastro ' + dataCadastro);
              const [dia, mes, ano] = dataCadastro.split('/');
              const date = new Date(+ano, +mes - 1, +dia);
              console.log(date);
              this.collectionCopy.data[i].data = date;
            }
          }).add(() => this.onSort('nome'));
        });
    }

    openModal(template: TemplateRef<any>, id: number) {
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

  ngOnInit(): void {
   /* this.service
      .getClientes()
      .subscribe(resposta => this.clientes = resposta); */
    const { mensagem } = window.history.state;
    if (mensagem) {
      this.listAlerts.push({
        "msg": mensagem,
        "timeout": this.TimeOut,
        "type": "success"
      });
    }

    this.carregaClientes(0);

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
    let strProximo_Windows1252 = "Próxima-->";
    this.labels.nextLabel = strProximo_Windows1252;
    let strPaginacao_Windows1252 = "Paginação";
    this.labels.screenReaderPaginationLabel = strPaginacao_Windows1252;
    let strPagina_Windows1252 = "Página";
    this.labels.screenReaderPageLabel = strPagina_Windows1252;
    let strPaginaAtual_Windows1252 = "Você está na página";
    this.labels.screenReaderCurrentLabel = strPaginaAtual_Windows1252;

    const table = document.getElementById('tbl_clientes');
    this.headers = table?.querySelectorAll('th');
    this.headers?.forEach((header: any, index: any) => {
     // window.console.log(header.innerHTML + ' ' + header.id + ' ' + index);
      this.orderFields.push({
        "field": header.id,
        "sortAsc": false,
        "current": false,
        "arrow": this.imgAsc,
        index
      })
    });
  }

  compare = (
    v1: string | number | boolean | Date,
    v2: string | number | boolean | Date
  ) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

  onSort(column: string) {
    console.log('onSort column ' + column);
    this.orderFields.forEach(o => o.current = false);
    const objIndex = this.orderFields.findIndex(obj => obj.field === column);
    if (objIndex !== -1) {
        this.orderFields[objIndex].sortAsc = !this.orderFields[objIndex].sortAsc;
    }
    if (column === '') {
      this.collectionCustomPagination = this.collectionCopy;
    } else {
        this.collectionCustomPagination.data = [...this.collectionCopy.data].sort((a, b) => {
        let res = this.compare(a[column], b[column]);
        this.orderFields[objIndex].current = true;
        const isAsc = this.orderFields[objIndex].sortAsc;
        isAsc ? this.orderFields[objIndex].arrow = this.imgAsc : this.orderFields[objIndex].arrow = this.imgDesc;
        return isAsc ? res : -res;
      });
    }
  }

  pesquisarNome(){
    /*
    this.collectionCustomPagination = {...this.collectionCopy};

    if ( this.campoPesquisa.trim() == "") {
      this.collectionCustomPagination = {...this.collectionCopy};
    }
    else {
      var dataPesquisa = this.collectionCustomPagination.data.filter
        (x => x.nome.toLowerCase().includes(this.campoPesquisa.toLowerCase()));
      this.collectionCustomPagination.data = dataPesquisa;
    } */
    this.carregaClientes();
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
  }

  teste() {
    console.log('teste');
  }

  deletarCliente(idCliente: number){
    this.service
      .deletar(idCliente)
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

  ok(): void {
    this.modalRef?.hide();
  }
}
