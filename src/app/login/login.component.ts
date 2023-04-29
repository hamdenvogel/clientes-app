import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './usuario';
import { UsuarioCadastro } from './usuarioCadastro';
import { AuthService } from '../auth.service';
import { Alert } from '../alert';
import { Constants } from '../shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  username: string;
  password: string;
  cadastrando: boolean;
  mensagemSucesso: string;
  errors: string[];
  listAlerts: Alert[] = [];
  TimeOut = Constants.TIMEOUT;

  constructor(
    private router: Router,
    private authService: AuthService,
    // private notificationService: NotificationService
  ) {}

  onSubmit(){
    const usuario: Usuario = new Usuario();
    usuario.login = this.username;
    usuario.senha = this.password;
    this.authService
          .tentarLogar(usuario)
          .subscribe(response => {
              const token = JSON.stringify(response);
              localStorage.setItem('token', token);
              localStorage.setItem('username', usuario.login);
              this.router.navigate(['/home'])
          }, errorResponse => {
            // this.errors = ['Usuário e/ou senha incorreto(s).']
            // this.notificationService.showToasterError("Usuário e/ou senha incorreto(s)",
            // "Erro");
             this.listAlerts.push({
              "msg": "Usuário e/ou senha incorreto(s)!",
              "timeout": this.TimeOut,
              "type": "danger"
            });
          })
  }

  preparaCadastrar(event){
    event.preventDefault();
    // this.notificationService.showToasterError("Operação desativada no momento. Contate o suporte","Desabilitado");
    this.listAlerts.push({
      "msg": "Operação desativada no momento. Contate o suporte!",
      "timeout": this.TimeOut,
      "type": "danger"
    });
    //this.cadastrando = true;
  }

  cancelaCadastro(){
    this.cadastrando = false;
  }

  cadastrar(){
    const usuarioCadastro: UsuarioCadastro = new UsuarioCadastro();
    usuarioCadastro.username = this.username;
    usuarioCadastro.password = this.password;
    this.authService
        .salvar(usuarioCadastro)
        .subscribe( response => {
            // this.mensagemSucesso = "Cadastro realizado com sucesso! Efetue o login.";
            // this.notificationService.showToasterSuccess(this.mensagemSucesso);
            this.listAlerts.push({
              "msg": "Cadastro realizado com sucesso! Efetue o login",
              "timeout": this.TimeOut,
              "type": "success"
            });
            this.cadastrando = false;
            this.username = '';
            this.password = '';
            this.errors = []
        }, errorResponse => {
            this.mensagemSucesso = null;
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
