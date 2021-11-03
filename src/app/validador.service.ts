import { InfoResponse } from './infoResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidadorService {

  apiURL: string = environment.apiURLBase + '/api/validador';

  constructor(private http: HttpClient) { }

  validarInteger(valor: string): Observable<InfoResponse> {
     return this.http.get<InfoResponse>(`${this.apiURL}/${valor}`);
  }
}
