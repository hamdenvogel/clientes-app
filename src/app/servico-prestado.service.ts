import { PaginaServico } from './servico-prestado/paginaServico';
import { TotalServicos } from './clientes/totalServicos';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ServicoPrestado } from './servico-prestado/servicoPrestado';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'
import { ServicoPrestadoBusca } from './servico-prestado/servico-prestado-lista/servicoPrestadoBusca';
import { InfoResponse } from './infoResponse';
import { ServicoFiltro } from './servicoFiltro';

@Injectable({
  providedIn: 'root'
})
export class ServicoPrestadoService {

  apiURL: string = environment.apiURLBase + "/api/servicos-prestados";

  constructor(private http: HttpClient) {}

  salvar(servicoPrestado: ServicoPrestado): Observable<ServicoPrestado>{
    return this.http.post<ServicoPrestado>(this.apiURL, servicoPrestado);
  }

  atualizar(servicoPrestado: ServicoPrestado): Observable<InfoResponse> {
    return this.http.put<InfoResponse>(`${this.apiURL}/${servicoPrestado.id}` , servicoPrestado);
  }

  deletar(idServico: number): Observable<InfoResponse> {
    return this.http.delete<InfoResponse>(`${this.apiURL}/${idServico}`);
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

  obterServicoPorId(id: number): Observable<ServicoPrestadoBusca>{
     return this.http.get<any>(`${this.apiURL}/${id}`);
  }

  obterPesquisaPaginada(page, size, sort, id): Observable<PaginaServico> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', sort)
    .set('id', id);
    return this.http.get<any>(`${this.apiURL}/pesquisa-paginada?${params.toString()}`);
  }

  obterPesquisaAvancada(page, size, sort, servicoFiltro: ServicoFiltro): Observable<PaginaServico> {

    let params = `page=${page}&size=${size}&sort=${sort}`;
    let filtroPrincipal: string = `${this.apiURL}/pesquisa-avancada?${params}`;

    if (servicoFiltro.cliente) {
      if (servicoFiltro.cliente > -1) {
        filtroPrincipal = `${filtroPrincipal}&cliente=${servicoFiltro.cliente}`;
      }
    };
    if (servicoFiltro.status) {
        filtroPrincipal = `${filtroPrincipal}&status=${servicoFiltro.status}`;
    };
    if (servicoFiltro.descricao) {
        filtroPrincipal = `${filtroPrincipal}&descricao=${servicoFiltro.descricao}`;
    };
    if (servicoFiltro.clienteNome) {
        filtroPrincipal = `${filtroPrincipal}&cliente.nome=${servicoFiltro.clienteNome}`;
    }
    return this.http.get<PaginaServico>(filtroPrincipal);
  }

  obterPesquisaServicosPrestadosEmAtendimento(page, size, servicoFiltro: ServicoFiltro): Observable<PaginaServico> {
    let params = `page=${page}&size=${size}&sort=id,desc&sort=cliente.nome,asc&status=E`;
    let filtroPrincipal: string = `${this.apiURL}/pesquisa-avancada?${params}`;
    if (servicoFiltro.clienteNome) {
      filtroPrincipal = `${filtroPrincipal}&cliente.nome=${servicoFiltro.clienteNome}`;
   }
    return this.http.get<PaginaServico>(filtroPrincipal);
  }

}
