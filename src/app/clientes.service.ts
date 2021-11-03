import { PaginaCliente } from './clientes/paginaCliente';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

import { Cliente } from './clientes/cliente';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'
import { TotalClientes } from './clientes/totalClientes';
import { InfoResponse } from './infoResponse';
import { ListaNomes } from './listaNomes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  apiURL: string = environment.apiURLBase + '/api/clientes';

  constructor( private http: HttpClient ) {}

  salvar(cliente: Cliente) : Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiURL}`, cliente);
  }

  atualizar(cliente: Cliente) : Observable<InfoResponse> {
    return this.http.put<InfoResponse>(`${this.apiURL}/${cliente.id}`, cliente);
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiURL);
  }

  getClienteById(id: number) : Observable<Cliente> {
    return this.http.get<any>(`${this.apiURL}/${id}`);
  }

  deletar(idCliente: number) : Observable<InfoResponse> {
    return this.http.delete<InfoResponse>(`${this.apiURL}/${idCliente}`);
  }

  totalClientes(): Observable<TotalClientes>{
    return this.http.get<TotalClientes>(`${this.apiURL}/totalClientes`);
  }

  obterPesquisaPaginada(page, size): Observable<PaginaCliente> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size);
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

  getListaNomes(): Observable<ListaNomes[]>{
    return this.http.get<ListaNomes[]>(`${this.apiURL}/lista-nomes`);
  }

}
