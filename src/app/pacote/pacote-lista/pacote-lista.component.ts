import { TotalPacotes } from './../totalPacotes';
import { PacoteService } from './../../pacote.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from './../../notification.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pacote } from '../pacote';
import { OrderFields } from 'src/app/order-fields';

@Component({
  selector: 'app-pacote-lista',
  templateUrl: './pacote-lista.component.html',
  styleUrls: ['./pacote-lista.component.css']
})
export class PacoteListaComponent implements OnInit {

  pacotes: Pacote[] = [];
  pacoteSelecionado: Pacote;
  mensagemSucesso: string;
  mensagemErro: string;
  errors: string[];
  campoPesquisa: string = "";
  config: any;
  collection = { count: 0, data: [] };
  configCustomPagination: any;
  collectionCustomPagination = { count: 0, data: [] };
  collectionCopy = { count: 0, data: [] };
  maxSize: number = 7;
  labels: any = {
    previousLabel: '<-Anterior',
    nextLabel: 'Pr&oacute;xima-->',
    screenReaderPaginationLabel: 'Pagina��o',
    screenReaderPageLabel: 'p�gina',
    screenReaderCurrentLabel: `Voce est� na p�gina`
  };
  totalPacotes: TotalPacotes;
  totalPacotesCadastrados: number;
  modalRef?: BsModalRef;
  idExclusaoPacote: number = 0;
  statusDetalhado = {'I': 'Iniciado', 'A': 'Aguardando atendimento', 'E': 'Em atendimento',
                     'C': 'Cancelado', 'F': 'Finalizado' };
  headers: any;
  orderFields: OrderFields[] = [];
  imgAsc = "../assets/arrow-asc.png";
  imgDesc = "../assets/arrow-desc.png";

  constructor(
    private service: PacoteService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: BsModalService
    ) {
      this.totalPacotes = new TotalPacotes();
     }

     consultar(){
      this.carregaPacotes();
    }

    carregaPacotes( pagina = 0, tamanho = 4){
      this.service
        .totalPacotes()
        .subscribe(resposta => {
          this.totalPacotes = resposta;
          this.totalPacotesCadastrados = (this.totalPacotes.totalPacotes == 0) ? 1 :  this.totalPacotes.totalPacotes;
          this.service.obterPesquisaPaginada(pagina,  this.totalPacotesCadastrados, this.campoPesquisa.trim())
          .subscribe(response => {
            this.pacotes = response.content;
            this.collection.data = this.pacotes;
            this.collection.count = response.totalElements;
            this.collectionCopy = {...this.collection};
            //this.pagina = response.number;
           }).add(() => this.onSort('id'));
        });
    }

    openModal(template: TemplateRef<any>, idPacote: number) {
      this.idExclusaoPacote = idPacote;
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

  ngOnInit(): void {
    this.carregaPacotes();

    this.collectionCustomPagination = this.collection;
    this.config = {
      id: 'basicPaginate',
      itemsPerPage: 4,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.configCustomPagination = {
      id: 'customPaginate',
      itemsPerPage: 4,
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

    const table = document.getElementById('tbl_pacotes');
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

  pesquisarDescricao(){
    /*
    this.collectionCustomPagination = {...this.collectionCopy};

    if ( this.campoPesquisa.trim() == "") {
      this.collectionCustomPagination = {...this.collectionCopy};
    }
    else {
      var dataPesquisa = this.collectionCustomPagination.data.filter
        (x => x.descricao.toLowerCase().includes(this.campoPesquisa.toLowerCase()));
      this.collectionCustomPagination.data = dataPesquisa;
    } */
    this.consultar();
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

  novoCadastro(){
    this.router.navigate(['/pacote/form'])
  }

  preparaDelecao(pacote: Pacote){
    this.pacoteSelecionado = pacote;
  }

  deletarPacote(idPacote: number){
    this.service
      .deletar(idPacote)
      .subscribe(
        response => {
          this.notificationService.showToasterSuccess('Pacote deletado com sucesso!');
          this.ngOnInit();
        },
        erro => {this.mensagemErro = 'Ocorreu um erro ao deletar o Pacote.',
          this.notificationService.showToasterError(this.mensagemErro,
          'Erro')
        }
      )
  }

  ok(): void {
    this.modalRef?.hide();
  }

  confirm(): void {
    if (this.idExclusaoPacote == 0) { return };
      this.service
        .deletar(this.idExclusaoPacote)
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
