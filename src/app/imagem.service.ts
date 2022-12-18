import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Imagem } from './imagem';

@Injectable({
  providedIn: 'root'
})
export class ImagemService  {

  apiURL: string = environment.apiURLBase + "/api/imagem";

  constructor(private http: HttpClient) {}

  obterPorDocumentoEChave(idDocumento: number, idChave: number): Observable<Imagem[]> {
    return this.http.get<Imagem[]>(`${this.apiURL}/consulta/${idDocumento}/${idChave}`);
   }

  salvar(idDocumento: number, idChave: number, file: File) : Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post(`${this.apiURL}/upload/${idDocumento}/${idChave}`,
       formdata, { responseType: 'blob', reportProgress: true });
  }

  deletar(idDocumento: number, idChave: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/documento-chave/${idDocumento}/${idChave}`);
  }

}
