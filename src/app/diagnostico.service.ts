import { PaginaDiagnostico } from './pagina-diagnostico';
import { Observable } from 'rxjs';
import { Diagnostico } from './diagnostico';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { TotalRegistros } from './total-registros';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

  apiURL: string = environment.apiURLBase + "/api/diagnostico";

  constructor(private http: HttpClient) { }

  salvar(diagnostico: Diagnostico): Observable<any>{
    return this.http.post<any>(this.apiURL,diagnostico);
  }

  alterar(diagnostico: Diagnostico): Observable<any>{
    return this.http.put<any>(`${this.apiURL}/${diagnostico.id}`,diagnostico);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

  alterarDescricao(diagnostico: Diagnostico): Observable<any>{
    return this.http.patch<any>(`${this.apiURL}/${diagnostico.id}`,diagnostico);
  }

  obterPorId(id: number): Observable<Diagnostico>{
    return this.http.get<Diagnostico>(`${this.apiURL}/${id}`);
  }

  obterPesquisaPaginada(page, size, descricao, idServicoPrestado): Observable<PaginaDiagnostico> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('descricao', descricao)
    .set('id-servico-prestado', idServicoPrestado)
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

  total(): Observable<TotalRegistros> {
    return this.http.get<TotalRegistros>(`${this.apiURL}/total`);
  }

}
