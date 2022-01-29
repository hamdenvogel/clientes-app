import { ValidadorService } from './../../validador.service';
import { ProfissaoService } from './../../profissao.service';
import { PrestadorService } from './../../prestador.service';
import { Component, OnInit } from '@angular/core';
import GoogleCaptchaService from 'src/app/google-captcha.service';
import { GoogleCaptcha } from 'src/app/googleCaptcha';
import { NotificationService } from '../../notification.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Prestador } from '../prestador';
import { Observable } from 'rxjs';
import { Profissao } from 'src/app/profissao';

@Component({
  selector: 'app-prestador-form',
  templateUrl: './prestador-form.component.html',
  styleUrls: ['./prestador-form.component.css']
})
export class PrestadorFormComponent implements OnInit {
  prestador: Prestador;
  success: boolean = false;
  errors: string[];
  id: number;
  captcha: string;
  googlecaptcha: GoogleCaptcha;
  profissoes: Profissao[] = [];
  valorValido: string;

  max = 10;
  isReadonly = false;

  constructor(
    private service: PrestadorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private googleCaptchaService: GoogleCaptchaService,
    private profissaoService: ProfissaoService,
    private validadorService: ValidadorService
  ) {
    this.prestador = new Prestador();
    this.prestador.profissao = new Profissao();
    this.captcha = "";
   }

  ngOnInit(): void {
    let params : Observable<Params> = this.activatedRoute.params;
    params.subscribe( urlParams => {
      this.id = urlParams['id'];
      if (this.id) {
        this.service
          .obterPorId(this.id)
          .subscribe(
            response => {
                this.prestador = response
            },
            errorResponse => this.prestador = new Prestador()
          );
      } else {
        this.prestador.nome = "";
      }
  });

  this.profissaoService
    .obterProfissoes()
    .subscribe(resposta => {
      this.profissoes = resposta;
    });

    if (this.prestador.avaliacao == undefined) {
      this.prestador.avaliacao = 0;
    }
  }

  confirmSelection(event: KeyboardEvent) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      this.isReadonly = true;
    }
  }

  resetStars($event) {
    this.isReadonly = !this.isReadonly;
    this.prestador.avaliacao = 0;
    $event.preventDefault();
  }

  confirmClickRating($event) {
    $event.preventDefault();
  }

  voltarParaListagem(){
    this.router.navigate(['/prestador/lista']);
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

    onSubmit(){
      this.prestador.captcha = this.captcha;
      if (this.prestador.profissao.id === undefined) {
         this.prestador.profissao.id = null;
      }
      this.prestador.idProfissao = this.prestador.profissao.id;
      this.success = true;
     /* if (this.prestador.avaliacao === undefined || this.valorValido === null) {
        this.valorValido = "...";
        console.log('Condição vazia testada ' + this.valorValido);
      }
      else {
          this.valorValido = this.prestador.avaliacao.toString();
      }
      this.validadorService
      .validarInteger(this.valorValido)
      .subscribe(response => {
      }, errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
        this.errors.forEach( (erro) =>{
           this.notificationService.showToasterError(erro, "erro");
        })
      });

      if (!this.success){
        console.log('this.success ' + this.success);
        return false;
      }
*/
      if (this.id) {
        this.service
          .atualizar(this.prestador)
          .subscribe(response => {
              this.success = true;
              this.router.navigate(['/prestador/lista']);
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
        .salvar(this.prestador)
        .subscribe(response => {
          this.success = true;
          this.router.navigate(['/prestador/lista']);
            this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
            response.infoResponseDTO.titulo);
          this.errors = null;
          this.prestador = new Prestador();
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
      this.prestador.avaliacao = 0;
      this.prestador.cpf = "";
      this.prestador.nome = "";
      this.prestador.pix = "";
      this.prestador.dataCadastro = "";
      this.prestador.profissao = new Profissao();
      this.prestador.email = "";
    }

}
