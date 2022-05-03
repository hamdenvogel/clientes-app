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
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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
  profissao: Profissao[] = [];
  valorValido: string;

  max = 10;
  isReadonly = false;
  dropdownSettings: IDropdownSettings = {};
  profissaoSelecionada = [];

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
                this.prestador = response,
                this.profissaoService.obterProfissaoPorId(this.prestador.profissao.id)
                  .subscribe(resposta => {
                     this.prestador.profissao.id = resposta.id;
                     this.profissaoSelecionada = [{ id: resposta.id,
                          descricao: resposta.descricao
                        }];
                     
                  })
            },
            errorResponse => this.prestador = new Prestador()
          );
      } else {
        this.prestador.nome = "";
      }
  });

    if (this.prestador.avaliacao == undefined) {
      this.prestador.avaliacao = 0;
    }

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'descricao',
      selectAllText: 'Selecionar Tudo',
      unSelectAllText: 'Tirar seleção de Tudo',
      searchPlaceholderText: 'Procurar',
      noDataAvailablePlaceholderText: 'Nenhum Registro Encontrado',
      closeDropDownOnSelection: true,
      maxHeight: 300,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      allowRemoteDataSearch: true
    };
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

   validaCampoProfissao(){
      this.prestador.profissao.id = this.profissaoSelecionada[0].id;
      this.prestador.idProfissao = this.prestador.profissao.id;
   }

    onSubmit(){
      this.prestador.captcha = this.captcha;
      if (this.profissaoSelecionada[0] == undefined) {
          this.notificationService.showToasterError("Favor selecionar uma Profissão", "Erro");
      }
      else if (this.id) {
          this.validaCampoProfissao();
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
          this.validaCampoProfissao();
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
      this.limparProfissao();
    }

    onItemSelect(item: any) {
      this.prestador.profissao.id = item.id;
    }

    onItemDeSelect(item: any){
      this.limparProfissao();
    }

    onSelectAll(items: any) {
      console.log('onSelectAll: ' + items);
    }

    onFilterChange(item: any){
      if (item.length < 3) {
        this.profissao = [];
      }
      else {
        this.profissaoService
        .obterProfissoes(item)
        .subscribe(resposta => {
          this.profissao = resposta;
        });
      }
    }

    limparProfissao() {
      this.profissaoSelecionada = [];
    }

}
