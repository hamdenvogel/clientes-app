import { Component, OnInit, TemplateRef } from '@angular/core';
import { ServicoPrestadoBusca } from './servicoPrestadoBusca';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { NotificationService } from './../../notification.service';
import { ListaNomes } from 'src/app/listaNomes';
import { ClientesService } from 'src/app/clientes.service';
import { Cliente } from 'src/app/clientes/cliente';
import { ServicoPrestado } from '../servicoPrestado';
import { ServicoFiltro } from 'src/app/servicoFiltro';
import { TotalServicos } from 'src/app/clientes/totalServicos';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-servico-prestado-lista',
  templateUrl: './servico-prestado-lista.component.html',
  styleUrls: ['./servico-prestado-lista.component.css']
})
export class ServicoPrestadoListaComponent implements OnInit {

  nome: string;
  //mes: number;
  //meses: number[];
  servicoPrestadoBusca: ServicoPrestadoBusca[];
  message: string;
  errors: string[];
  //listaNomes: ListaNomes[] = [];
  nomeCliente: string = '';
  clientes: Cliente[] = [];
  idCliente: number;
  status: string;
  servicoPrestado: ServicoPrestado;
  servicoPrestadoLista: ServicoPrestado[] = [];
  servicoFiltro: ServicoFiltro;
  statusDetalhado = {'E': 'Em Atendimento', 'C': 'Cancelado', 'F': 'Finalizado' };
  totalServicos: TotalServicos;
  totalServicosCadastrados: number;

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
  modalRef?: BsModalRef;
  idExclusaoServico: number = 0;

  constructor(
    private service: ServicoPrestadoService,
    private notificationService: NotificationService,
    private clienteService: ClientesService,
    private modalService: BsModalService
  ) {
    this.totalServicos = new TotalServicos();
  }

  carregaServicos( pagina = 0, tamanho = 4, sort = 'cliente.nome,asc', servicoFiltro: ServicoFiltro){

    this.collection = { count: 0, data: [] };
    this.collectionCustomPagination = { count: 0, data: [] };
    this.collectionCopy = { count: 0, data: [] };

    this.service
        .totalServicos()
        .subscribe(resposta => {
          this.totalServicos = resposta;
          this.totalServicosCadastrados = this.totalServicos.totalServicos;
          this.service.obterPesquisaAvancada(pagina, this.totalServicosCadastrados, sort, servicoFiltro)
            .subscribe(response => {
              this.servicoPrestadoLista = response.content;
              this.collection.data = this.servicoPrestadoLista;
              this.collection.count = response.totalElements;
              this.collectionCopy = {...this.collection};
              //this.pagina = response.number;
            })
        });

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

  ngOnInit(): void {
    /* this.clienteService.getListaNomes()
                 .subscribe(dados => {
                    this.listaNomes = dados
                 });
                 */

    this.clienteService
      .getClientes()
      .subscribe(response => this.clientes = response);

     this.servicoPrestado =  new ServicoPrestado();
     this.servicoPrestado.idCliente = -1;
     this.servicoPrestado.descricao = "";
     this.servicoPrestado.status = "";
     this.consultar();
  }

  apagar() {
     this.servicoPrestado.idCliente = -1;
     this.servicoPrestado.descricao = "";
     this.servicoPrestado.status = "";
  }

  consultar(){
    this.servicoFiltro = new ServicoFiltro;
    if (this.servicoPrestado.idCliente) {
      this.servicoFiltro.cliente = this.servicoPrestado.idCliente;
    }

    if (this.servicoPrestado.status) {
      this.servicoFiltro.status = this.servicoPrestado.status;
    }

    if (this.servicoPrestado.descricao) {
      this.servicoFiltro.descricao = this.servicoPrestado.descricao;
    }

    this.carregaServicos(0,4,'cliente.nome,asc', this.servicoFiltro);
  }

  pesquisarDescricao(){
    this.collectionCustomPagination = {...this.collectionCopy};

    if ( this.campoPesquisa.trim() == "") {
      this.collectionCustomPagination = {...this.collectionCopy};
    }
    else {
      var dataPesquisa = this.collectionCustomPagination.data.filter
        (x => x.descricao.toLowerCase().includes(this.campoPesquisa.toLowerCase()));
      this.collectionCustomPagination.data = dataPesquisa;
    }
  }

  onKeyUp(evento: KeyboardEvent){
    //console.log('onKeyUp ' + (<HTMLInputElement>evento.target).value);
    this.pesquisarDescricao();
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  onPageChange(event) {
    this.configCustomPagination.currentPage = event;
  }

  openModal(template: TemplateRef<any>, idServico: number) {
    this.idExclusaoServico = idServico;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    if (this.idExclusaoServico == 0) { return };
      this.service
        .deletar(this.idExclusaoServico)
        .subscribe(
          response => {
            this.notificationService.showToasterSuccessWithTitle(response.mensagem,
              response.titulo);
            this.errors = null;
            this.consultar();
          },
           errorResponse => {
            this.errors = errorResponse.error.errors;
              this.errors.forEach( (erro) =>{
                this.notificationService.showToasterError(erro, "erro");
              })
          }
        )

    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
