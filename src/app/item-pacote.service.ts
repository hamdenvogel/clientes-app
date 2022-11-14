import { ItemPacote } from './item-pacote/item-pacote';
import { PaginaItemPacote } from './paginaItemPacote';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfoResponse } from './infoResponse';

@Injectable({
  providedIn: 'root'
})
export class ItemPacoteService {

  apiURL: string = environment.apiURLBase + "/api/item-pacote";

  constructor(private http: HttpClient) { }

  obterPesquisaPaginada(page, size, pacote): Observable<PaginaItemPacote>{
    let params: string;
    if (pacote) {
      params = `page=${page}&size=${size}&pacote=${pacote}`;
    } else {
      params = `page=${page}&size=${size}`;
    }
    let filtroPrincipal: string = `${this.apiURL}/pesquisa-avancada?${params}`;
    return this.http.get<PaginaItemPacote>(`${this.apiURL}/${filtroPrincipal}`);
  }

  salvar(itemPacote: ItemPacote): Observable<ItemPacote>{
    return this.http.post<ItemPacote>(this.apiURL, itemPacote);
  }

  deletar(id: number): Observable<InfoResponse>{
    return this.http.delete<InfoResponse>(`${this.apiURL}/${id}`);
  }

}
