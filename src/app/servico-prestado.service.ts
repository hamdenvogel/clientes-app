import { PaginaServico } from './servico-prestado/paginaServico';
import { TotalServicos } from './clientes/totalServicos';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServicoPrestado } from './servico-prestado/servicoPrestado';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'
import { ServicoPrestadoBusca } from './servico-prestado/servico-prestado-lista/servicoPrestadoBusca';

@Injectable({
  providedIn: 'root'
})
export class ServicoPrestadoService {

  apiURL: string = environment.apiURLBase + "/api/servicos-prestados";

  constructor(private http: HttpClient) {}

  salvar(servicoPrestado: ServicoPrestado): Observable<ServicoPrestado>{
    return this.http.post<ServicoPrestado>(this.apiURL, servicoPrestado);
  }

  buscar(nome: string, mes: number): Observable<ServicoPrestadoBusca[]>{
  console.log("nome " + nome + " mes " + mes);
    const httpParams = new HttpParams()
      .set("nome", nome)
      .set("mes", mes ?  mes.toString() : '');

    const url = this.apiURL + "?" + httpParams.toString();
    return this.http.get<any>(url);
  }

  totalServicos(): Observable<TotalServicos>{
    return this.http.get<TotalServicos>(`${this.apiURL}/totalServicos`);
  }

  obterServicosDoCliente(id: string): Observable<ServicoPrestadoBusca[]>{
    const httpParams = new HttpParams()
      .set("id", id);

    const url = this.apiURL + "?" + httpParams.toString();
    return this.http.get<any>(`${this.apiURL}/pesquisa-cliente/${id}`);
  }

  obterPesquisaPaginada(page, size, sort, id): Observable<PaginaServico> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', sort)
    .set('id', id);
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

}
