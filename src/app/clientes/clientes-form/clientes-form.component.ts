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
import { Constants } from 'src/app/shared/constants';
import { Imagem } from 'src/app/imagem';
import { ImagemService } from 'src/app/imagem.service';

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

  foto: any;
  filename: string = "";
  files: any[] = [];
  @ViewChild('inputFile', { static: true }) inputFile: ElementRef;
  fileList: File[] = [];
  codigoClienteDocumento: number = Constants.CodigoClienteDocumento;
  imagem: Imagem[] = [];
  originalFileName: string = "";
  fotoNotFound: string = Constants.fotoNotFound;

  constructor(
      private service: ClientesService ,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private notificationService: NotificationService,
      private cepService: CepService,
      private googleCaptchaService: GoogleCaptchaService,
      private imagemService: ImagemService
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
            this.obterImagem(this.id);
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

  obterImagem(idChave: number = 0) {
    this.foto = [];
    this.filename = "";
    this.originalFileName = "";
    if (idChave != undefined) {
      this.imagemService.obterPorDocumentoEChave(this.codigoClienteDocumento, idChave)
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
                this.imagemService.salvar(this.codigoClienteDocumento, this.cliente.id, item)
                .subscribe(resposta => {
                  this.obterImagem(this.cliente.id);
                });
         }
     }
 }
}

alterarImagem() {
  this.imagemService
      .deletar(this.codigoClienteDocumento, this.cliente.id)
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
      .deletar(this.codigoClienteDocumento, this.cliente.id)
      .subscribe(resposta => {
        this.obterImagem();
      });
 }

  voltarParaListagem(){
    this.router.navigate(['/clientes/lista'])
  }

  onSubmit(){
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
            this.cliente.id = response.id;
            this.salvarImagem();
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
