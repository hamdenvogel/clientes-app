import { Cidade } from './../../cidade';
import { UF } from './../../uf';
import { CepService } from './../../cep.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'

import { Cliente } from '../cliente'
import { ClientesService } from '../../clientes.service'
import { empty, fromEvent, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from '../../notification.service';
import { EMPTY } from 'rxjs';
import { Endereco } from 'src/app/endereco';
import GoogleCaptchaService from 'src/app/google-captcha.service';
import { GoogleCaptcha } from 'src/app/googleCaptcha';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  cliente: Cliente;
  success: boolean = false;
  errors: string[];
  id: number;
  cepPesquisado: string = "";
  endereco: Endereco = null;
  @ViewChild('cep', {static: true}) cep: ElementRef;
  @ViewChild('inputUf', {static: true}) inputUf: ElementRef;
  @ViewChild('inputCidade', {static: true}) inputCidade: ElementRef;
  uf: UF[];
  cidade: Cidade[];
  cidadeDesabilitado: boolean;
  captcha: string;
  googlecaptcha: GoogleCaptcha;

  constructor(
      private service: ClientesService ,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private notificationService: NotificationService,
      private cepService: CepService,
      private googleCaptchaService: GoogleCaptchaService
      ) {
    this.cliente = new Cliente();
    this.cliente.nome = "";
    this.cliente.cpf = "";
    this.cidadeDesabilitado = false;
    this.captcha = "";
  }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.service
            .getClienteById(this.id)
            .subscribe(
              response => {
                  this.cliente = response,
                  this.cepService.obterCidadesNome(this.cliente.cidade)
                 .subscribe(dados => {
                    this.cidade = dados,
                    this.cidadeDesabilitado = true;
                 })
              },
              errorResponse => this.cliente = new Cliente()
            );
        } else {
          this.cliente.uf = "";
          this.cliente.cidade = "";
        }
    });

    fromEvent(this.cep.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,filter(res => res.length == 8)
      ,debounceTime(500)
      ,distinctUntilChanged()
    ).subscribe(cep => {
      this.cidadeDesabilitado = false;
      this.cepService.pesquisarCEP(cep).subscribe(response => {
        this.endereco = response;
        this.cliente.endereco = this.endereco.logradouro + " " + this.endereco.bairro;
        this.cliente.complemento = this.endereco.complemento;
        this.cliente.uf = this.endereco.uf;
        this.cliente.cidade = this.endereco.localidade;
        this.cepService.obterCidadesNome(this.cliente.cidade)
                 .subscribe(dados => {
                    this.cidade = dados,
                    this.cidadeDesabilitado = true;
                 })
      });
    });

    this.cepService.obterUF()
      .subscribe(dados => this.uf = dados);

   fromEvent(this.inputUf.nativeElement, 'change').pipe(
        tap(estado => console.log('Novo estado: ', this.cliente.uf)),
        map(estado => this.uf.filter(e => e.sigla === this.cliente.uf)),
        map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
        switchMap((estadoId: number) => this.cepService.obterCidades(estadoId))
      )
      .subscribe(cidades => {
          this.cidade = cidades,
          this.cidadeDesabilitado = false });

     this.googleCaptchaService.zerarTentativasMalSucedidas()
        .subscribe(response => {});
  }

  voltarParaListagem(){
    this.router.navigate(['/clientes/lista'])
  }

  onSubmit(){
    console.log('this.captcha ' + this.captcha);
    this.cliente.captcha = this.captcha;

    if (this.id) {
      this.service
        .atualizar(this.cliente)
        .subscribe(response => {
            this.success = true;
            this.router.navigate(['/clientes/lista']);
            //this.notificationService.showToasterSuccess("Cliente atualizado com sucesso!");
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
        .salvar(this.cliente)
          .subscribe( response => {
            this.success = true;
            this.router.navigate(['/clientes/lista']);
            //this.notificationService.showToasterSuccess("Cliente salvo com sucesso!");
            this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
              response.infoResponseDTO.titulo);
            this.errors = null;
            this.cliente = response;
          }, errorResponse => {
            this.success = false;
            this.errors = errorResponse.error.errors;
            this.errors.forEach( (erro) =>{
              this.notificationService.showToasterError(erro, "erro");
            })
          })
    }
  }

   resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.googleCaptchaService.verificar(this.captcha)
      .subscribe(response => {
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

    apagar() {
      this.cliente.cep = "";
      this.cliente.cidade = "";
      this.cliente.complemento = "";
      this.cliente.cpf = "";
      this.cliente.dataCadastro = "";
      this.cliente.endereco = "";
      this.cliente.pix = "";
      this.cliente.uf = "";
      if (!this.id) {
        this.cliente.nome = "";
      }
   }

    }
