import { UsuarioCadastro } from './login/usuarioCadastro';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from './login/usuario';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL: string = environment.apiURLBase + "/api/usuarios"
  tokenURL: string = environment.apiURLBase + environment.obterTokenUrl
  clientID: string = environment.clientId;
  clientSecret: string = environment.clientSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient
  ) { }

  obterToken(){
    const tokenString = localStorage.getItem('token')
    if(tokenString){
      const token = JSON.parse(tokenString).token;
      return token;
    }
    return null;
  }

  encerrarSessao(){
    localStorage.removeItem('token');
  }

  getUsuarioAutenticado(){
    console.log('init getUsuarioAutenticado()');
    const token = this.obterToken();
    if(token){
      //const usuario = this.jwtHelper.decodeToken(token).username;
	  const usuario = localStorage.getItem('username');
      console.log('usuario: ' + usuario);
      return usuario;
    }
    return null;
  }

  isAuthenticated() : boolean {
    const token = this.obterToken();
    if(token){
      const expired = this.jwtHelper.isTokenExpired(token);
      return !expired;
    }
    return false;
  }

  salvar(usuarioCadastro: UsuarioCadastro) : Observable<any> {
    return this.http.post<UsuarioCadastro>(this.apiURL, usuarioCadastro);
  }

  tentarLogar(usuario: Usuario) : Observable<any> {
    return this.http.post<Usuario>(this.tokenURL, usuario);
  }

  /*tentarLogar( username: string, password: string ) : Observable<any> {
    const params = new HttpParams()
                        .set('login', username)
                        .set('senha', password);

    console.log('login '+ username);
    console.log('senha '+ password);
    /*const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientID}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    } */
 //    return this.http.post<Usuario>(this.tokenURL, {params});
 // }
 // */


}
