import { ItemPacote } from './item-pacote/item-pacote';
import { PaginaItemPacote } from './paginaItemPacote';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfoResponse } from './infoResponse';
import { TotalItensPacotes } from './pacote/totalItensPacotes';

@Injectable({
  providedIn: 'root'
})
export class ItemPacoteService {

  apiURL: string = environment.apiURLBase + "/api/item-pacote";

  constructor(private http: HttpClient) { }

  obterPesquisaPaginada(page, size, pacote): Observable<PaginaItemPacote>{
    let params: string;
    if (pacote) {
      params = `page=${page}&size=${size}&pacote=${pacote}&sort=servicoPrestado.id,asc`;
    } else {
      params = `page=${page}&size=${size}&sort=servicoPrestado.id,asc`;
    }
    let filtroPrincipal: string = `${this.apiURL}/pesquisa-paginada?${params}`;
    return this.http.get<PaginaItemPacote>(filtroPrincipal);
  }

  salvar(itemPacote: ItemPacote): Observable<ItemPacote>{
    return this.http.post<ItemPacote>(this.apiURL, itemPacote);
  }

  deletar(id: number): Observable<InfoResponse>{
    return this.http.delete<InfoResponse>(`${this.apiURL}/${id}`);
  }

  totalPorPacote(idPacote: number): Observable<TotalItensPacotes> {
    return this.http.get<TotalItensPacotes>(`${this.apiURL}/total-por-pacote/${idPacote}`);
  }

  deletaPacoteEServicoPrestado(idPacote: number, idServicoPrestado: number): Observable<InfoResponse>{
    return this.http.delete<InfoResponse>(`${this.apiURL}/pacote/${idPacote}/servico/${idServicoPrestado}`);
  }

}
