import { ServicoPrestado } from './../../servico-prestado/servicoPrestado';
import { ServicoPrestadoBusca } from './../../servico-prestado/servico-prestado-lista/servicoPrestadoBusca';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { Cliente } from '../cliente'
import { ClientesService } from '../../clientes.service'
import { Observable } from 'rxjs';
import { NotificationService } from '../../notification.service';
import { ServicoPrestadoService } from 'src/app/servico-prestado.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TotalServicos } from '../totalServicos';
import { ServicoFiltro } from 'src/app/servicoFiltro';

@Component({
  selector: 'app-clientes-remover',
  templateUrl: './clientes-remover.component.html',
  styleUrls: ['./clientes-remover.component.css']
})
export class ClientesRemoverComponent implements OnInit {
  cliente: Cliente;
  success: boolean = false;
  errors: string[];
  id: number;
  mensagemSucesso: string;
  mensagemErro: string;
  lista: ServicoPrestadoBusca[];
  bExistemServicosProCliente: boolean;
  servicos: ServicoPrestado[] = [];
  statusDetalhado = {'E': 'Em Atendimento', 'C': 'Cancelado', 'F': 'Finalizado' };
  modalRef?: BsModalRef;
  totalServicos: TotalServicos;
  totalServicosCadastrados: number;
  servicoFiltro: ServicoFiltro;

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

  constructor(private service: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private servicoPrestadoService: ServicoPrestadoService,
    private modalService: BsModalService
    ) {
      this.cliente = new Cliente(); { }
      this.bExistemServicosProCliente = false;
      this.totalServicos = new TotalServicos();
   }

  carregaServicos( pagina = 0, tamanho = 10, sort = 'descricao,asc', id){
    this.servicoFiltro = new ServicoFiltro;
    this.servicoFiltro.cliente = id;
    console.log('id ' + id);
    this.servicoPrestadoService
    .totalServicos()
    .subscribe(resposta => {
      this.totalServicos = resposta;
      this.totalServicosCadastrados = this.totalServicos.totalServicos;
      this.servicoPrestadoService.obterPesquisaAvancada(pagina, this.totalServicosCadastrados, sort,
        this.servicoFiltro)
        .subscribe(response => {
          this.servicos = response.content;
          this.collection.data = this.servicos;
          this.collection.count = response.totalElements;
          this.collectionCopy = {...this.collection};
          //this.pagina = response.number;
        })
    });
  }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params
    params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.service
            .getClienteById(this.id)
            .subscribe(
              response => this.cliente = response,
              errorResponse => this.cliente = new Cliente()
            );

          this.obterServicosDoCliente(this.id.toString());
          this.carregaServicos(0,10,'descricao,asc', this.id);
        };
    });

    /*for (var i = 0; i < this.collection.count; i++) {
      this.collection.data.push(
        {
          id: i + 1,
          value: "Collection value " + (i + 1)
        }
      );
    }
    */
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

  deletarCliente(id: number){
    this.service
      .deletar(id)
      .subscribe(
        response => {
          this.notificationService.showToasterSuccessWithTitle(response.mensagem,
            response.titulo);
          this.errors = null;
          this.voltarParaListagem();
        },
        errorResponse => {
          this.errors = errorResponse.error.errors;
            this.errors.forEach( (erro) =>{
              this.notificationService.showToasterError(erro, "erro");
            })
        }
      )
  }

  voltarParaListagem(){
    this.router.navigate(['/clientes/lista'])
  }

  obterServicosDoCliente(idCliente: string){
    this.servicoPrestadoService
      .obterServicosDoCliente(idCliente)
      .subscribe(response => {
         this.lista = response;
         if( this.lista.length > 0 ){
          this.bExistemServicosProCliente = true;
          this.notificationService.showToasterError("Existem Serviços Cadastrados. O Cliente\n" +
          "não poderá ser deletado.", "Erro");
        }else{
          this.bExistemServicosProCliente = false;
        }
      });
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

  onChange(event: any) {
    //console.log('onChange ' + event.target.value);
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  onPageChange(event) {
    this.configCustomPagination.currentPage = event;
  }

  openModal(template: TemplateRef<any>, idCliente: number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    if (!this.id) { return };
    this.deletarCliente(this.id);
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }
}
