import { PaginaPrestador } from './prestador/paginaPrestador';
import { InfoResponse } from './infoResponse';
import { Prestador } from './prestador/prestador';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { TotalPrestadores } from './prestador/totalPrestadores';
import { map } from 'rxjs/operators';

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

  /* obterRelatorio(dataInicio: string, dataFim: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.apiURL}/relatorio?inicio=${dataInicio}&fim=${dataFim}`);
  } */

  obterRelatorio(dataInicio: string, dataFim: string): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.get<ArrayBuffer>(`${this.apiURL}/relatorio?inicio=${dataInicio}&fim=${dataFim}`, {
        observe: 'response',
        responseType: 'arraybuffer' as 'json'
    });
  }

  obterRelatorio2(dataInicio: string, dataFim: string): Observable<Blob> {
    return this.http.get(`${this.apiURL}/relatorio?inicio=${dataInicio}&fim=${dataFim}`,
     { responseType: 'blob'});
  }

  obterRelatorio3(dataInicio: string, dataFim: string): Observable<Blob> {
    return this.http.get(`${this.apiURL}/relatorio?inicio=${dataInicio}&fim=${dataFim}`,
     { responseType: 'blob'}).pipe(map(
      (res) => {
          return new Blob([res], { type: 'application/pdf' });
      }));
  }

}
