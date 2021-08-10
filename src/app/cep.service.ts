import { UF } from './uf';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Endereco } from './endereco';
import { Cidade } from './cidade';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  apiURL: string = environment.apiURLBase + "/api/cep";

  constructor(private http: HttpClient) { }

  pesquisarCEP(cep: string): Observable<Endereco>{
    return this.http.get<Endereco>(`${this.apiURL}/${cep}`);
  }

  obterUF() {
    return this.http.get<UF[]>('assets/dados/estadosbr.json');
  }

  obterListaCidades() {
    return this.http.get<Cidade[]>('assets/dados/cidades.json');
  }

/*  obterCidades() {
    return this.http.get<Cidade[]>('assets/dados/cidades.json');
  }
  */

 obterCidades(idEstado: number) {
    return this.http.get<Cidade[]>('assets/dados/cidades.json')
    .pipe(
      map((cidades: Cidade[]) => cidades.filter(c => c.estado == idEstado))
    );
  }

  obterCidadesNome(nome: string) {
    return this.http.get<Cidade[]>('assets/dados/cidades.json')
    .pipe(
      map((cidades: Cidade[]) => cidades.filter(c => c.nome == nome))
    );
  }

}
