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
import { Constants } from 'src/app/shared/constants';
import { Alert } from 'src/app/alert';
import { OrderFields } from 'src/app/order-fields';

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
    nextLabel: 'Pr�xima-->',
    screenReaderPaginationLabel: 'Pagina��o',
    screenReaderPageLabel: 'p�gina',
    screenReaderCurrentLabel: `Voce est� na p�gina`
  };
  modalRef?: BsModalRef;
  idExclusaoServico: number = 0;
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
    private servicoPrestadoService: ServicoPrestadoService,
    private notificationService: NotificationService,
    private clienteService: ClientesService,
    private modalService: BsModalService
  ) {
    this.totalServicos = new TotalServicos();
  }

  ngOnInit(): void {
    /* this.clienteService.getListaNomes()
                 .subscribe(dados => {
                    this.listaNomes = dados
                 });
                 */
    const { mensagem } = window.history.state;
    if (mensagem) {
      this.listAlerts.push({
        "msg": mensagem,
        "timeout": this.TimeOut,
        "type": "success"
      });
    }
    this.clienteService
      .getClientes()
      .subscribe(response => this.clientes = response);

     this.servicoPrestado =  new ServicoPrestado();
     this.servicoPrestado.idCliente = -1;
     this.servicoPrestado.descricao = "";
     this.servicoPrestado.status = "";
     this.campoPesquisa = "";
     this.consultar();
     let strProximo_Windows1252 = "Próxima-->";
    this.labels.nextLabel = strProximo_Windows1252;
    let strPaginacao_Windows1252 = "Paginação";
    this.labels.screenReaderPaginationLabel = strPaginacao_Windows1252;
    let strPagina_Windows1252 = "Página";
    this.labels.screenReaderPageLabel = strPagina_Windows1252;
    let strPaginaAtual_Windows1252 = "Você está na página";
    this.labels.screenReaderCurrentLabel = strPaginaAtual_Windows1252;

    const table = document.getElementById('tbl_servicos_prestados');
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

  apagar() {
     this.servicoPrestado.idCliente = -1;
     this.servicoPrestado.descricao = "";
     this.servicoPrestado.status = "";
     this.campoPesquisa = "";
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
    if ( this.campoPesquisa.trim() != "" && this.campoPesquisa != undefined) {
      this.servicoFiltro.clienteNome = this.campoPesquisa.trim();
      this.carregaServicos(0,4,'descricao,asc', this.servicoFiltro);
    }
    else {
      this.carregaServicos(0,4,'cliente.nome,asc', this.servicoFiltro);
    }
  }

  pesquisarDescricao(){
   /* this.collectionCustomPagination = {...this.collectionCopy};

    if ( this.campoPesquisa.trim() == "") {
      this.collectionCustomPagination = {...this.collectionCopy};
    }
    else {
      var dataPesquisa = this.collectionCustomPagination.data.filter
        (x => x.descricao.toLowerCase().includes(this.campoPesquisa.toLowerCase()));
      this.collectionCustomPagination.data = dataPesquisa;
    } */

    this.servicoPrestado.idCliente = -1;
    this.servicoPrestado.descricao = "";
    this.servicoPrestado.status = "";
    this.consultar();
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
      this.servicoPrestadoService
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

  gerarRelatorio(dataInicio: string, dataFim: string) {
    this.servicoPrestadoService.obterRelatorio(dataInicio, dataFim)
      .subscribe((blob: Blob) => {
        window.console.log('report is downloaded');
        const fileName = "relatório-serviços-prestados.pdf";
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

  carregaServicos( pagina = 0, tamanho = 4, sort = 'cliente.nome,asc', servicoFiltro: ServicoFiltro){
    this.collection = { count: 0, data: [] };
    this.collectionCustomPagination = { count: 0, data: [] };
    this.collectionCopy = { count: 0, data: [] };
    this.loading = true;

    this.servicoPrestadoService
        .totalServicos()
        .subscribe(resposta => {
          this.totalServicos = resposta;
          this.totalServicosCadastrados = (this.totalServicos.totalServicos == 0) ? 1: this.totalServicos.totalServicos;
          this.servicoPrestadoService.obterPesquisaAvancada(pagina, this.totalServicosCadastrados, sort, servicoFiltro)
            .subscribe(response => {
              this.servicoPrestadoLista = response.content;
              this.collection.data = this.servicoPrestadoLista;
              this.collection.count = response.totalElements;
              this.collectionCopy = {...this.collection};
              //this.pagina = response.number;
            }).add(() => {
              for (let i = 0; i < this.collectionCopy.data.length; i++) {
                let dataServico = this.collectionCopy.data[i].data;
                window.console.log('dataCadastro ' + dataServico);
                const [dia, mes, ano] = dataServico.split('/');
                const date = new Date(+ano, +mes - 1, +dia);
                console.log(date);
                this.collectionCopy.data[i].dataServico = date;
                this.collectionCopy.data[i].clienteNome = this.collectionCopy.data[i].cliente.nome;
              }
            }).add(() => this.onSort('clienteNome'))
            .add(() => this.loading = false);
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
}
