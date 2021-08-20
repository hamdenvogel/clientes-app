import { Component, OnInit } from '@angular/core';
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
  previousDate: Date;
  captcha: string;
  googlecaptcha: GoogleCaptcha;

  constructor(
    private clienteService: ClientesService,
    private service: ServicoPrestadoService,
    private notificationService: NotificationService,
    private localeService: BsLocaleService,
    private activatedRoute: ActivatedRoute,
    private googleCaptchaService: GoogleCaptchaService,
    private router: Router
  ) {
    ptBrLocale.invalidDate = '';
    defineLocale('custom locale', ptBrLocale);
    this.localeService.use('custom locale');
    this.servico = new ServicoPrestado();
    this.captcha = null;
  }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if(this.id){
          console.log(`id: ${this.id}`);
        }
        else {
          console.log('não tem id.');
        }
    });

    this.clienteService
      .getClientes()
      .subscribe(response => this.clientes = response);

    this.googleCaptchaService
      .zerarTentativasMalSucedidas()
      .subscribe(response => {});
  }

  onSubmit(){
    let date = new Date(this.servico.data).toLocaleDateString();
    this.servico.data = date;
    if (this.servico.data == 'Invalid Date') { this.servico.data = ""};

    if (this.servico.idCliente != undefined
      && this.servico.descricao != "" && this.servico.descricao != undefined
      && this.servico.data != "" && this.servico.data != undefined
      && this.servico.preco != "" && this.servico.preco != undefined
      && this.servico.status != null && this.servico.status != undefined
      &&
      this.captcha == null) {
        this.notificationService.showToasterError("\É necessário validar o Captcha.",
               "Erro");
        return false;
      }

    this.service
      .salvar(this.servico)
      .subscribe(response => {
        this.success = true;
        this.router.navigate(['/servicos-prestados/lista']);
        this.notificationService.showToasterSuccess('Servi\ço cadastrado com sucesso.',
         'Informa\ç\ão');
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

  getDate(){
    let date = new Date(this.servico.data).toLocaleDateString();
    console.log('Data selecionada é: ' + date);
  }

  onValueChange(value: Date): void {
    // this.servico.data = value;
    this.previousDate = new Date(value);
  }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.googleCaptchaService.verificar(this.captcha)
      .subscribe( response => {
        this.success = true;
        this.errors = null;
        this.googlecaptcha = response;
        //console.log(`this.googlecaptcha: ${this.googlecaptcha}`);
        //this.notificationService.showToasterSuccess("Token validado com sucesso!",
        //      "Informação");
      }, errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
        this.errors.forEach( (erro) =>{
         // this.notificationService.showToasterError(erro, "erro");
        })
      })
    }

}
