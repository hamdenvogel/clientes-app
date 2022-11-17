import { TotalPacotes } from './../totalPacotes';
import { PacoteService } from './../../pacote.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from './../../notification.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Pacote } from '../pacote';

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
    nextLabel: 'Próxima-->',
    screenReaderPaginationLabel: 'Paginação',
    screenReaderPageLabel: 'página',
    screenReaderCurrentLabel: `Voce está na página`
  };
  totalPacotes: TotalPacotes;
  totalPacotesCadastrados: number;
  modalRef?: BsModalRef;
  idExclusaoPacote: number = 0;
  statusDetalhado = {'I': 'Iniciado', 'A': 'Aguardando atendimento', 'E': 'Em atendimento',
                     'C': 'Cancelado', 'F': 'Finalizado' };

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
           })
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
