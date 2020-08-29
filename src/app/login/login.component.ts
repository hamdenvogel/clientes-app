import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './usuario';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string;
  password: string;
  cadastrando: boolean;
  mensagemSucesso: string;
  errors: String[];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
    //console.log(`User: ${this.username}, Password: ${this.password}`);
    this.authService
          .tentarLogar(this.username, this.password)
          .subscribe(response => {
             //console.log('response subscribe tentarLogar() ' + response);
             const access_token = JSON.stringify(response);
             localStorage.setItem('access_token', access_token);
             this.router.navigate(['/home'])
          }, errorResponse => {
            this.errors = ['Usuário e/ou senha incorreto(s).']
          })
  }

  preparaCadastrar(event) {
    event.preventDefault();
    this.cadastrando = true;
  }

  cancelaCadastro(){
    this.cadastrando = false;
  }

  cadastrar() {
    const usuario: Usuario = new Usuario();
    usuario.username = this.username;
    usuario.password = this.password;
    this.authService
        .salvar(usuario) 
        .subscribe(response => {
            this.mensagemSucesso = "Cadastro realizado com sucesso. Efetue o Login!";
            this.cadastrando = false;
            this.username = '';
            this.password = '';
            this.errors = [];
        }, errorResponse => {
          this.mensagemSucesso = null;
          this.errors = errorResponse.error.errors;          
        })
  }
  
}
