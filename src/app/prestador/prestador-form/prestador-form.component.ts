import { ImagemService } from './../../imagem.service';
import { ValidadorService } from './../../validador.service';
import { ProfissaoService } from './../../profissao.service';
import { PrestadorService } from './../../prestador.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import GoogleCaptchaService from 'src/app/google-captcha.service';
import { GoogleCaptcha } from 'src/app/googleCaptcha';
import { NotificationService } from '../../notification.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Prestador } from '../prestador';
import { Observable } from 'rxjs';
import { Profissao } from 'src/app/profissao';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Constants } from 'src/app/shared/constants';
import { Imagem } from 'src/app/imagem';
import { Alert } from 'src/app/alert';

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

  foto: any;
  filename: string = "";
  files: any[] = [];
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  fileList: File[] = [];
  codigoPrestadorDocumento: number = Constants.CodigoPrestadorDocumento;
  imagem: Imagem[] = [];
  originalFileName: string = "";
  fotoNotFound: string = Constants.fotoNotFound;
  TimeOut = Constants.TIMEOUT;
  listAlerts: Alert[] = [];

  constructor(
    private service: PrestadorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    // private notificationService: NotificationService,
    private googleCaptchaService: GoogleCaptchaService,
    private profissaoService: ProfissaoService,
    private validadorService: ValidadorService,
    private imagemService: ImagemService
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
          this.obterImagem(this.id);
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
      unSelectAllText: 'Tirar seleÃ§Ã£o de Tudo',
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

  obterImagem(idChave: number = 0) {
    this.foto = [];
    this.filename = "";
    this.originalFileName = "";
    if (idChave != undefined) {
      this.imagemService.obterPorDocumentoEChave(this.codigoPrestadorDocumento, idChave)
      .subscribe(resposta => {
         this.imagem = resposta;
            if (this.imagem[0] != undefined) {
              this.foto = 'data:image/jpeg;base64,' + this.imagem[0].data;
              this.filename = this.imagem[0].fileName;
              this.originalFileName = this.imagem[0].originalFileName;
            }
      });
    }
   }

 onFileChanged(event: any) {
    this.files = event.target.files;
  }

 selectFile(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        this.fileList.push(selectedFile);
        this.filename = selectedFile;
    }
    if (this.filename != "") { //se é alteração então já salva logo, porque já tem o id do objeto.
       this.alterarImagem();
    }
 }

 deleteFile(index: number, nome: any) {
    // remover item do array File[] FileList
    this.fileList.splice(index, 1);
 }

 salvarImagem() {
  if (this.fileList != undefined) {
     if (this.fileList.length) {
         for (let i = 0; i < this.fileList.length; i++) {
                const formData: FormData = new FormData();
                formData.append('files', this.fileList[i], this.fileList[i].name);
                let item: File = this.fileList[i];
                this.imagemService.salvar(this.codigoPrestadorDocumento, this.prestador.id, item)
                .subscribe(resposta => {
                  this.obterImagem(this.prestador.id);
                });
         }
     }
 }
}

alterarImagem() {
  this.imagemService
      .deletar(this.codigoPrestadorDocumento, this.prestador.id)
      .subscribe(resposta => {
        this.salvarImagem();
      }, error => {
        if (error.status === 404) {
          this.salvarImagem();
        }
      });
}

deletarImagem() {
      this.imagemService
      .deletar(this.codigoPrestadorDocumento, this.prestador.id)
      .subscribe(resposta => {
        this.obterImagem();
      });
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
          // this.notificationService.showToasterError("Favor selecionar uma ProfissÃ£o", "Erro");
          this.listAlerts.push({
            "msg": "Favor selecionar uma ProfissÃ£o",
            "timeout": this.TimeOut,
            "type": "danger"
          });
      }
      else if (this.id) {
          this.validaCampoProfissao();
          this.service
            .atualizar(this.prestador)
            .subscribe(response => {
                  this.success = true;
                // this.router.navigate(['/prestador/lista']);
                this.router.navigate(['/prestador/lista'], { state: {mensagem: response.mensagem }});
                // this.notificationService.showToasterSuccessWithTitle(response.mensagem,
                //  response.titulo);

                this.errors = null;
            }, errorResponse => {
              this.errors = errorResponse.error.errors;
                this.errors.forEach( (erro) =>{
                  // this.notificationService.showToasterError(erro, "erro");
                  this.listAlerts.push({
                    "msg": erro,
                    "timeout": this.TimeOut,
                    "type": "danger"
                  });
                })
            })
        } else {
          this.validaCampoProfissao();
          this.service
            .salvar(this.prestador)
            .subscribe(response => {
              this.prestador.id = response.id;
              this.salvarImagem();
              this.success = true;
              // this.router.navigate(['/prestador/lista']);
              this.router.navigate(['/prestador/lista'], { state: {mensagem: response.infoResponseDTO.mensagem }});
              //  this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
              //  response.infoResponseDTO.titulo);
              this.errors = null;
              this.prestador = new Prestador();
            } , errorResponse => {
              this.success = false;
              this.errors = errorResponse.error.errors;
              this.errors.forEach( (erro) =>{
              // this.notificationService.showToasterError(erro, "erro");
                this.listAlerts.push({
                  "msg": erro,
                  "timeout": this.TimeOut,
                  "type": "danger"
                });
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
