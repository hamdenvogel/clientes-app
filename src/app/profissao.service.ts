import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profissao } from './profissao';

@Injectable({
  providedIn: 'root'
})
export class ProfissaoService {

  apiURL: string = environment.apiURLBase + "/api/profissao";

  constructor(private http: HttpClient) { }

  obterProfissoes(): Observable<Profissao[]> {
    return this.http.get<Profissao[]>(this.apiURL);
  }

}
