import { NaturezaFiltro } from './naturezaFiltro';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Natureza } from './natureza';


@Injectable({
  providedIn: 'root'
})
export default class NaturezaService {

  apiURL: string = environment.apiURLBase + "/api/natureza";

  constructor(private http: HttpClient) {}

  obterTodos(): Observable<NaturezaFiltro>{
    return this.http.get<NaturezaFiltro>(this.apiURL);
  }

}
