import { PaginaPrestador } from './prestador/paginaPrestador';
import { InfoResponse } from './infoResponse';
import { Prestador } from './prestador/prestador';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { TotalPrestadores } from './prestador/totalPrestadores';

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {

  apiURL: string = environment.apiURLBase + "/api/prestador";

  constructor(private http: HttpClient) {}

  salvar(prestador: Prestador): Observable<Prestador>{
    return this.http.post<Prestador>(this.apiURL, prestador);
  }

  atualizar(prestador: Prestador): Observable<InfoResponse> {
    return this.http.put<InfoResponse>(`${this.apiURL}/${prestador.id}` , prestador);
  }

  deletar(idPrestador: number): Observable<InfoResponse> {
    return this.http.delete<InfoResponse>(`${this.apiURL}/${idPrestador}`);
  }

  obterTodos(): Observable<Prestador[]> {
    return this.http.get<Prestador[]>(this.apiURL);
  }

  obterPorId(idPrestador: number): Observable<Prestador> {
    return this.http.get<Prestador>(`${this.apiURL}/${idPrestador}`);
  }

  obterPesquisaPaginada(page, size, nome): Observable<PaginaPrestador> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('nome', nome)
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

  totalPrestadores(): Observable<TotalPrestadores>{
    return this.http.get<TotalPrestadores>(`${this.apiURL}/totalPrestadores`);
  }

}
