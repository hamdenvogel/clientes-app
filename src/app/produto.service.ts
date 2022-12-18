import { PaginaProduto } from './produto/paginaProduto';
import { Produto } from './produto/produto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { InfoResponse } from './infoResponse';
import { TotalProdutos } from './produto/totalProdutos';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  apiURL: string = environment.apiURLBase + "/api/produtos";

  constructor(private http: HttpClient) { }

  salvar(produto: Produto): Observable<Produto>{
    return this.http.post<Produto>(this.apiURL, produto);
  }

  atualizar(produto: Produto): Observable<InfoResponse> {
    return this.http.put<InfoResponse>(`${this.apiURL}/${produto.id}` , produto);
  }

  deletar(idProduto: number): Observable<InfoResponse> {
    return this.http.delete<InfoResponse>(`${this.apiURL}/${idProduto}`);
  }

  obterTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiURL);
  }

  obterPorId(idProduto: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiURL}/${idProduto}`);
  }

  obterPesquisaPaginada(page, size, descricao): Observable<PaginaProduto> {
    const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('descricao', descricao)
    return this.http.get<any>(`${this.apiURL}/pesquisa-avancada?${params.toString()}`);
  }

  totalProdutos(): Observable<TotalProdutos>{
    return this.http.get<TotalProdutos>(`${this.apiURL}/totalProdutos`);
  }
}
