import { TotalUsuarios } from './clientes/totalUsuarios';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  apiURL: string = environment.apiURLBase + '/api/usuarios';

  constructor( private http: HttpClient) {}

  totalUsuarios(): Observable<TotalUsuarios>{
    return this.http.get<TotalUsuarios>(`${this.apiURL}/totalUsuarios`);
  }
}
