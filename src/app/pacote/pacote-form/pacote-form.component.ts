import { ItemPacoteService } from './../../item-pacote.service';
import { ServicoPrestadoService } from 'src/app/servico-prestado.service';
import { PacoteService } from './../../pacote.service';
import { Pacote } from './../pacote';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { EMPTY, from, Observable, of } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TotalServicos } from 'src/app/clientes/totalServicos';
import { ServicoPrestado } from 'src/app/servico-prestado/servicoPrestado';
import { ServicoFiltro } from 'src/app/servicoFiltro';
import { filter, isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-pacote-form',
  templateUrl: './pacote-form.component.html',
  styleUrls: ['./pacote-form.component.css']
})
export class PacoteFormComponent implements OnInit {
  pacote: Pacote;
  success: boolean = false;
  errors: string[];
  id: number;
  @ViewChild('inputDataPrevisao', {static: true}) inputDataPrevisao: ElementRef;
  @ViewChild('inputDataConclusao', {static: true}) inputDataConclusao: ElementRef;
  tempDatePrevisao: Date;
  tempDateConclusao: Date;

  status: string;
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
    private pacoteService: PacoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private servicoPrestadoService: ServicoPrestadoService,
    private modalService: BsModalService,
    private itemPacoteService: ItemPacoteService
  ) {
    this.pacote = new Pacote();
    this.totalServicos = new TotalServicos();
   }

  convertDate(dateString){
    if (dateString != null) {
      var p = dateString.split(/\D/g)
      return [p[2],p[1],p[0] ].join("/");
    }
  }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
      this.id = urlParams['id'];
      if (this.id) {
        this.pacoteService
          .obterPorId(this.id)
          .subscribe(
            response => {
                this.pacote = response;
                this.pacote.data_previsao = this.convertDate(this.pacote.data_previsao);
                this.pacote.data_conclusao = this.convertDate(this.pacote.data_conclusao);
            },
            errorResponse => this.pacote = new Pacote()
          );

      } else {
        this.pacote.descricao = "";
      }
    });

    this.campoPesquisa = "";
    this.consultarServicosEmAtendimento();
  }

  voltarParaListagem(){
    this.router.navigate(['/pacote/lista']);
  }

  onSubmit(){
    this.success = true;
    if (this.idExclusaoServico != 0) { return };
    if (this.pacote.data_previsao == 'Invalid Date' || this.pacote.data_previsao == null) {
       this.pacote.data_previsao  = "";
    };

    if (this.id) {
      this.pacoteService
        .atualizar(this.pacote)
        .subscribe(response => {
            this.success = true;
           // this.router.navigate(['/pacote/lista']);
            this.notificationService.showToasterSuccessWithTitle(response.mensagem,
              response.titulo);
            this.errors = null;
        }, errorResponse => {
          this.errors = errorResponse.error.errors;
            this.errors.forEach( (erro) =>{
              this.notificationService.showToasterError(erro, "erro");
            })
        })
    } else {
    this.pacoteService
      .salvar(this.pacote)
      .subscribe(response => {
        this.success = true;
        //this.router.navigate(['/pacote/lista']);
        this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
          response.infoResponseDTO.titulo);
        this.errors = null;
        this.pacote = new Pacote();
      } , errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
        this.errors.forEach( (erro) =>{
          this.notificationService.showToasterError(erro, "erro");
        })
      })
    }
  }

  apagar() {
    this.pacote.descricao = "";
    this.pacote.justificativa = "";
    this.pacote.data_previsao = null;
    this.pacote.data_conclusao = null;
    this.pacote.status = null;
  }

  dataServicoFormatadaPrevisao(){
    var data = new Date(this.tempDatePrevisao),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

dataServicoFormatadaConclusao(){
  var data = new Date(this.tempDateConclusao),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(),
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return diaF+"/"+mesF+"/"+anoF;
}

  onValueChangeDtPrevisao(value: Date): void {
    if (this.inputDataPrevisao.nativeElement.value != "") {
      this.tempDatePrevisao = new Date(value);
      this.pacote.data_previsao = this.dataServicoFormatadaPrevisao();
    }
  }

  onValueChangeDtConclusao(value: Date): void {
    if (this.inputDataConclusao.nativeElement.value != "") {
      this.tempDateConclusao = new Date(value);
      this.pacote.data_conclusao = this.dataServicoFormatadaConclusao();
    }
  }

  carregaServicos( pagina = 0, tamanho = 4, servicoFiltro: ServicoFiltro){

    this.collection = { count: 0, data: [] };
    this.collectionCustomPagination = { count: 0, data: [] };
    this.collectionCopy = { count: 0, data: [] };

    this.servicoPrestadoService
        .totalServicos()
        .subscribe(resposta => {
          this.totalServicos = resposta;
          this.totalServicosCadastrados = (this.totalServicos.totalServicos == 0) ? 1: this.totalServicos.totalServicos;
          this.servicoPrestadoService.obterPesquisaServicosPrestadosEmAtendimento
            (pagina, this.totalServicosCadastrados, servicoFiltro)
              .subscribe(response => {
                this.servicoPrestadoLista = response.content;
                this.collection.data = this.servicoPrestadoLista;
                this.collection.count = response.totalElements;
                this.collectionCopy = {...this.collection};
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

  consultarServicosEmAtendimento(){
    this.servicoFiltro = new ServicoFiltro;

    if (this.campoPesquisa.trim() != "" && this.campoPesquisa != undefined) {
      this.servicoFiltro.clienteNome = this.campoPesquisa.trim();
    }
      this.carregaServicos(0,4, this.servicoFiltro);
  }

  pesquisarDescricao(){
     this.consultarServicosEmAtendimento();
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

  checkAllCheckBox(ev) {
		this.servicoPrestadoLista.forEach(x => x.checked = ev.target.checked)
	}

	isAllCheckBoxChecked() {
		return this.servicoPrestadoLista.every(p => p.checked);
	}

  vincularServico(){
   var itenscheckados = from(this.servicoPrestadoLista)
      .pipe(
        filter(val => {
          return val.checked;
        })
      )
      .subscribe(resposta => {
        console.log('itens checkados ' + resposta.id + " " + resposta.descricao);
    });

    let algumItemCheckado: boolean = false;
    for (let i in this.servicoPrestadoLista){
      let item = this.servicoPrestadoLista[i];
      let itemCheckado = item.checked;
      if (itemCheckado) {
        algumItemCheckado = true;
        break;
      }
    }
    if (!algumItemCheckado) {
      this.notificationService.showToasterError('Favor selecionar algum Serviço!','Erro');
    } else {
      console.log('algum item foi checkado');
    }
  }

  openModal(template: TemplateRef<any>, idServico: number) {
    this.idExclusaoServico = idServico;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    if (this.idExclusaoServico == 0) { return };
      this.servicoPrestadoService
        .deletar(this.idExclusaoServico)
        .subscribe(
          response => {
            this.notificationService.showToasterSuccessWithTitle(response.mensagem,
              response.titulo);
            this.errors = null;
            this.idExclusaoServico = 0;
            this.consultarServicosEmAtendimento();
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
    this.idExclusaoServico = 0;
    this.modalRef?.hide();
  }

  novoServico(){
    this.router.navigate(['/servicos-prestados/form/redireciona']);
  }

  carregaItemPacote(pagina = 0, tamanho = 4, pacote) {
    this.itemPacoteService.obterPesquisaPaginada(pagina, tamanho, pacote);
  }
}
