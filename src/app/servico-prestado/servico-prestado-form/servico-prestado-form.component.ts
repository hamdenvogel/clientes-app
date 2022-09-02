import { NaturezaFiltro } from './../../naturezaFiltro';
import { Natureza } from './../../natureza';
import { PrestadorService } from './../../prestador.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../clientes/cliente';
import { ClientesService } from '../../clientes.service'
import { ServicoPrestado } from '../servicoPrestado';
import { ServicoPrestadoService } from '../../servico-prestado.service';
import { NotificationService } from './../../notification.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import GoogleCaptchaService from 'src/app/google-captcha.service';
import { GoogleCaptcha } from 'src/app/googleCaptcha';
import { Prestador } from 'src/app/prestador/prestador';
import NaturezaService from 'src/app/natureza.service';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-servico-prestado-form',
  templateUrl: './servico-prestado-form.component.html',
  styleUrls: ['./servico-prestado-form.component.css']
})
export class ServicoPrestadoFormComponent implements OnInit {

  clientes: Cliente[] = [];
  servico: ServicoPrestado;
  id: number;
  success: boolean = false;
  errors: string[];
  tempDate: Date;
  captcha: string;
  googlecaptcha: GoogleCaptcha;
  @ViewChild('inputData', {static: true}) inputData: ElementRef;
  prestadores: Prestador[] = [];
  natureza: Natureza[] = [];

  constructor(
    private clienteService: ClientesService,
    private service: ServicoPrestadoService,
    private notificationService: NotificationService,
    private localeService: BsLocaleService,
    private activatedRoute: ActivatedRoute,
    private googleCaptchaService: GoogleCaptchaService,
    private router: Router,
    private prestadorService: PrestadorService,
    private naturezaService: NaturezaService
  ) {
    ptBrLocale.invalidDate = '';
    defineLocale('custom locale', ptBrLocale);
    this.localeService.use('custom locale');
    this.servico = new ServicoPrestado();
    this.captcha = "";
    this.servico.prestador = new Prestador();
    this.servico.natureza = new Natureza();
  }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.service.obterServicoPorId(this.id)
          .subscribe(
            response => {
              this.servico.id =  this.id,
              this.servico.descricao = response.descricao,
              this.servico.preco = response.valor.toString().replace(".",","),
              this.servico.data = response.data,
              this.servico.idCliente = response.cliente.id,
              this.servico.status = response.status,
              this.servico.idPrestador = response.prestador == null ? undefined:  response.prestador.id,
              this.servico.prestador.id = this.servico.idPrestador,
              this.servico.tipo = response.tipo,
              this.servico.idNatureza = response.natureza == null ? undefined:  response.natureza.id
           },
            errorResponse => this.servico = new ServicoPrestado()
          );
        }
        else {
          console.log('on init this.servico.data ' + this.inputData.nativeElement.value);
        }
    });

    this.clienteService
      .getClientes()
      .subscribe(response => this.clientes = response);

    this.googleCaptchaService
      .zerarTentativasMalSucedidas()
      .subscribe(response => {});

    this.prestadorService
      .obterTodos()
      .subscribe(resposta => {
        this.prestadores = resposta;
      });

    this.naturezaService
      .obterTodos()
      .subscribe(resposta => {
        this.natureza = resposta.content;
      });
  }

  onSubmit(){
    if (this.servico.data == 'Invalid Date' || this.servico.data == null)
        { this.servico.data = ""};

    if (this.servico.preco != undefined) {
       this.servico.preco = this.servico.preco.toString().replace(".",",");
     }

    if (this.servico.prestador.id === undefined) {
      this.servico.prestador.id = null;
      this.servico.idPrestador = null;
    }
    this.servico.idPrestador = this.servico.prestador.id;

    this.servico.captcha = this.captcha;

    if (this.id) {
        this.service
          .atualizar(this.servico)
          .subscribe(response => {
              this.success = true;
              this.router.navigate(['/servicos-prestados/lista']);
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
      this.service
        .salvar(this.servico)
        .subscribe(response => {
          this.success = true;
          this.router.navigate(['/servicos-prestados/lista']);
            this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
            response.infoResponseDTO.titulo);
          this.errors = null;
          this.servico = new ServicoPrestado();
        } , errorResponse => {
          this.success = false;
          this.errors = errorResponse.error.errors;
          this.errors.forEach( (erro) =>{
            this.notificationService.showToasterError(erro, "erro");
          })
        })
      }
  }

  dataServicoFormatada(){
    var data = new Date(this.tempDate),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

  onValueChange(value: Date): void {
    if (this.inputData.nativeElement.value != "") {
      this.tempDate = new Date(value);
      this.servico.data = this.dataServicoFormatada();
    }
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.googleCaptchaService.verificar(this.captcha)
      .subscribe( response => {
        this.success = true;
        this.errors = null;
        this.googlecaptcha = response;
      }, errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
        this.errors.forEach( (erro) =>{
         // this.notificationService.showToasterError(erro, "erro");
        })
      })
    }

}
