import { PrestadorService } from './../../prestador.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from './../../notification.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Prestador } from '../prestador';
import { TotalPrestadores } from '../totalPrestadores';


@Component({
  selector: 'app-prestador-lista',
  templateUrl: './prestador-lista.component.html',
  styleUrls: ['./prestador-lista.component.css']
})
export class PrestadorListaComponent implements OnInit {

  prestadores: Prestador[] = [];
  prestadorSelecionado: Prestador;
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
    nextLabel: 'Proxima-->',
    screenReaderPaginationLabel: 'Paginacao',
    screenReaderPageLabel: 'pagina',
    screenReaderCurrentLabel: `Voce esta na pagina`
  };
  totalPrestadores: TotalPrestadores;
  totalPrestadoresCadastrados: number;
  modalRef?: BsModalRef;
  idExclusaoPrestador: number = 0;

  constructor(
    private service: PrestadorService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) {
    this.totalPrestadores = new TotalPrestadores();
  }

  consultar(){
    this.carregaPrestadores();
  }

  carregaPrestadores( pagina = 0, tamanho = 4){
    this.service
      .totalPrestadores()
      .subscribe(resposta => {
        this.totalPrestadores = resposta;
        this.totalPrestadoresCadastrados = (this.totalPrestadores.totalPrestadores == 0) ? 1 :  this.totalPrestadores.totalPrestadores;
        this.service.obterPesquisaPaginada(pagina,  this.totalPrestadoresCadastrados)
        .subscribe(response => {
          this.prestadores = response.content;
          this.collection.data = this.prestadores;
          this.collection.count = response.totalElements;
          this.collectionCopy = {...this.collection};
          //this.pagina = response.number;
         })
      });
  }

  openModal(template: TemplateRef<any>, idPrestador: number) {
    this.idExclusaoPrestador = idPrestador;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

ngOnInit(): void {
  this.carregaPrestadores();

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
  this.router.navigate(['/prestador/form'])
}

preparaDelecao(prestador: Prestador){
  this.prestadorSelecionado = prestador;
}

teste() {
  console.log('teste');
}

deletarPrestador(idPrestador: number){
  this.service
    .deletar(idPrestador)
    .subscribe(
      response => {
        //this.mensagemSucesso = 'Prestador deletado com sucesso!'
        this.notificationService.showToasterSuccess('Prestador deletado com sucesso!');
        this.ngOnInit();
      },
      erro => {this.mensagemErro = 'Ocorreu um erro ao deletar o prestador.',
        this.notificationService.showToasterError(this.mensagemErro,
        'Erro')
      }

    )
}

ok(): void {
  this.modalRef?.hide();
}

confirm(): void {
  if (this.idExclusaoPrestador == 0) { return };
    this.service
      .deletar(this.idExclusaoPrestador)
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
