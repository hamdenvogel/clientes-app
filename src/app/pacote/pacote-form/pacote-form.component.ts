import { PacoteService } from './../../pacote.service';
import { Pacote } from './../pacote';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pacote-form',
  templateUrl: './pacote-form.component.html',
  styleUrls: ['./pacote-form.component.css']
})
export class PacoteFormComponent implements OnInit {
  pacote: Pacote;
  success: boolean = false;
  errors: string[];
  id: number;
  @ViewChild('inputDataPrevisao', {static: true}) inputDataPrevisao: ElementRef;
  @ViewChild('inputDataConclusao', {static: true}) inputDataConclusao: ElementRef;
  tempDatePrevisao: Date;
  tempDateConclusao: Date;

  constructor(
    private service: PacoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.pacote = new Pacote();
   }

  convertDate(dateString){
    if (dateString != null) {
      var p = dateString.split(/\D/g)
      return [p[2],p[1],p[0] ].join("/");
    }
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
                this.pacote = response;
                this.pacote.data_previsao = this.convertDate(this.pacote.data_previsao);
                this.pacote.data_conclusao = this.convertDate(this.pacote.data_conclusao);
            },
            errorResponse => this.pacote = new Pacote()
          );
      } else {
        this.pacote.descricao = "";
      }
  });
  }

  voltarParaListagem(){
    this.router.navigate(['/pacote/lista']);
  }

  onSubmit(){
    this.success = true;
    if (this.pacote.data_previsao == 'Invalid Date' || this.pacote.data_previsao == null)
        { this.pacote.data_previsao  = ""};


    if (this.id) {
      this.service
        .atualizar(this.pacote)
        .subscribe(response => {
            this.success = true;
            this.router.navigate(['/pacote/lista']);
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
      .salvar(this.pacote)
      .subscribe(response => {
        this.success = true;
        this.router.navigate(['/pacote/lista']);
          this.notificationService.showToasterSuccessWithTitle(response.infoResponseDTO.mensagem,
          response.infoResponseDTO.titulo);
        this.errors = null;
        this.pacote = new Pacote();
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
    this.pacote.descricao = "";
    this.pacote.justificativa = "";
    this.pacote.data_previsao = null;
    this.pacote.data_conclusao = null;
    this.pacote.status = null;
  }

  dataServicoFormatadaPrevisao(){
    var data = new Date(this.tempDatePrevisao),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}

dataServicoFormatadaConclusao(){
  var data = new Date(this.tempDateConclusao),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(),
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return diaF+"/"+mesF+"/"+anoF;
}

  onValueChangeDtPrevisao(value: Date): void {
    if (this.inputDataPrevisao.nativeElement.value != "") {
      this.tempDatePrevisao = new Date(value);
      this.pacote.data_previsao = this.dataServicoFormatadaPrevisao();
    }
  }

  onValueChangeDtConclusao(value: Date): void {
    if (this.inputDataConclusao.nativeElement.value != "") {
      this.tempDateConclusao = new Date(value);
      this.pacote.data_conclusao = this.dataServicoFormatadaConclusao();
    }
  }
}
