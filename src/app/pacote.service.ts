import { TotalPacotes } from './pacote/totalPacotes';
import { PaginaPacote } from './pacote/paginaPacote';
import { InfoResponse } from './infoResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pacote } from './pacote/pacote';

@Injectable({
  providedIn: 'root'
})
export class PacoteService {

  apiURL: string = environment.apiURLBase + "/api/pacote";

  constructor(private http: HttpClient) {}

  salvar (pacote: Pacote): Observable<Pacote> {
    return this.http.post<Pacote>(this.apiURL, pacote);
  }

  atualizar (pacote: Pacote): Observable<InfoResponse> {
    return this.http.put<InfoResponse>(`${this.apiURL}/${pacote.id}` , pacote);
  }

  deletar (idPacote: number): Observable<InfoResponse>{
    return this.http.delete<InfoResponse>(`${this.apiURL}/${idPacote}`);
  }

  obterTodos(): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(this.apiURL);
  }

  obterPorId (idPacote: number): Observable<Pacote>{
    return this.http.get<Pacote>(`${this.apiURL}/${idPacote}`);
  }

  obterPesquisaPaginada(page, size, descricao): Observable<PaginaPacote> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('descricao', descricao)
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

  totalPacotes(): Observable<TotalPacotes>{
    return this.http.get<TotalPacotes>(`${this.apiURL}/totalPacotes`);
  }
}
