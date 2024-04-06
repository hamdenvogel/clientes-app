import { ImagemService } from './../../imagem.service';
import { PrestadorService } from './../../prestador.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from './../../notification.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Prestador } from '../prestador';
import { TotalPrestadores } from '../totalPrestadores';
import { Constants } from 'src/app/shared/constants';
import { Alert } from 'src/app/alert';
import { OrderFields } from 'src/app/order-fields';


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
    nextLabel: 'Pr�xima-->',
    screenReaderPaginationLabel: 'Pagina��o',
    screenReaderPageLabel: 'p�gina',
    screenReaderCurrentLabel: `Voce est� na p�gina`
  };
  totalPrestadores: TotalPrestadores;
  totalPrestadoresCadastrados: number;
  modalRef?: BsModalRef;
  idExclusaoPrestador: number = 0;
  TimeOut = Constants.TIMEOUT2;
  TimeOut3 = Constants.TIMEOUT3;
  listAlerts: Alert[] = [];
  headers: any;
  orderFields: OrderFields[] = [];
  imgAsc = "../assets/arrow-asc.png";
  imgDesc = "../assets/arrow-desc.png";
  listAlertsReport: Alert[] = [];
  dtInicioConsulta = "";
  dtFimConsulta = "";
  loading = true;

  constructor(
    private prestadorService: PrestadorService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: BsModalService,
    private imagemService: ImagemService
  ) {
    this.totalPrestadores = new TotalPrestadores();
  }

ngOnInit(): void {
  const { mensagem } = window.history.state;
    if (mensagem) {
      this.listAlerts.push({
        "msg": mensagem,
        "timeout": this.TimeOut,
        "type": "success"
      });
    }
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
  let strProximo_Windows1252 = "Próxima-->";
    this.labels.nextLabel = strProximo_Windows1252;
    let strPaginacao_Windows1252 = "Paginação";
    this.labels.screenReaderPaginationLabel = strPaginacao_Windows1252;
    let strPagina_Windows1252 = "Página";
    this.labels.screenReaderPageLabel = strPagina_Windows1252;
    let strPaginaAtual_Windows1252 = "Você está na página";
    this.labels.screenReaderCurrentLabel = strPaginaAtual_Windows1252;

    const table = document.getElementById('tbl_prestadores');
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
  this.consultar();
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
  this.prestadorService
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
  let codigoPrestadorDocumento: number = Constants.CodigoPrestadorDocumento;
    this.prestadorService
      .deletar(this.idExclusaoPrestador)
      .subscribe(
        response => {
          this.notificationService.showToasterSuccessWithTitle(response.mensagem,
            response.titulo);
            this.imagemService
              .deletar(codigoPrestadorDocumento, this.idExclusaoPrestador)
              .subscribe();
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

gerarRelatorio(dataInicio: string, dataFim: string) {
  this.prestadorService.obterRelatorio3(dataInicio, dataFim)
    .subscribe((blob: Blob) => {
      window.console.log('report is downloaded');
      const fileName = "relatório-prestadores.pdf";
          let link = document.createElement("a");
          if (link.download !== undefined)
          {
              let url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", fileName);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.open(url, '_blank');
          }
          else
          {
              //html5 download not supported
          }
        });
}

pesquisar(): void {
  window.console.log('dtInicioConsulta ' + this.dtInicioConsulta);
  window.console.log('dtFimConsulta ' + this.dtFimConsulta);
  let dtInicio, dtFim;
  if (this.dtInicioConsulta === "" || this.dtInicioConsulta === undefined ||
      this.dtFimConsulta === "" || this.dtFimConsulta === undefined) {
        this.listAlertsReport.push({
          "msg": "Data Inválida",
          "timeout": this.TimeOut3,
          "type": "danger"
        });
  } else
  {
      dtInicio = new Date(this.dtInicioConsulta).toISOString().split('T')[0];
      const anoDtInicio = dtInicio.split("-")[0];
      const mesDtInicio = dtInicio.split("-")[1];
      const diaDtInicio = dtInicio.split("-")[2];
      const dtInicioStr = diaDtInicio + "/" + mesDtInicio + "/" + anoDtInicio;

      dtFim = new Date(this.dtFimConsulta).toISOString().split('T')[0];
      const anoDtFim = dtFim.split("-")[0];
      const mesDtFim = dtFim.split("-")[1];
      const diaDtFim = dtFim.split("-")[2];
      const dtFimStr = diaDtFim + "/" + mesDtFim + "/" + anoDtFim;

      window.console.log('dtInicio ' + dtInicio + ' dtFim ' + dtFim);

      if (dtInicio > dtFim) {
        this.listAlertsReport.push({
          "msg": "Data Inicial não pode ser maior que a Data Final",
          "timeout": this.TimeOut3,
          "type": "danger"
        });
      }
      else {
        this.gerarRelatorio(dtInicioStr, dtFimStr);
      }
  }
}

limparPesquisa(): void {
  this.dtInicioConsulta = "";
  this.dtFimConsulta = "";
}

consultar(){
  this.carregaPrestadores();
}

carregaPrestadores( pagina = 0){
  this.loading = true;
  this.prestadorService
    .totalPrestadores()
    .subscribe(resposta => {
      this.totalPrestadores = resposta;
      this.totalPrestadoresCadastrados = (this.totalPrestadores.totalPrestadores == 0) ? 1 :  this.totalPrestadores.totalPrestadores;
      this.prestadorService.obterPesquisaPaginada(pagina,  this.totalPrestadoresCadastrados, this.campoPesquisa.trim())
      .subscribe(response => {
        this.prestadores = response.content;
        this.collection.data = this.prestadores;
        this.collection.count = response.totalElements;
        this.collectionCopy = {...this.collection};
        //this.pagina = response.number;
       }).add(() => {
        for (let i = 0; i < this.collectionCopy.data.length; i++) {
          let dataCadastro = this.collectionCopy.data[i].dataCadastro;
          const [dia, mes, ano] = dataCadastro.split('/');
          const date = new Date(+ano, +mes - 1, +dia);
          console.log(date);
          this.collectionCopy.data[i].data = date;
        }
      }).add(() => this.onSort('nome'))
      .add(() => this.loading = false);
    });
}

openModal(template: TemplateRef<any>, idPrestador: number) {
  this.idExclusaoPrestador = idPrestador;
  this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
}

}
