import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoogleCaptcha } from './googleCaptcha';
import { InfoResponse } from './infoResponse';

@Injectable({
  providedIn: 'root'
})
export default class GoogleCaptchaService {

  apiURL: string = environment.apiURLBase + "/api/google";

  constructor(private http: HttpClient) {}

  verificar(token: string): Observable<GoogleCaptcha>{
    return this.http.post<GoogleCaptcha>(`${this.apiURL}/${token}`,"");
  }

  zerarTentativasMalSucedidas(): Observable<any>{
    return this.http.get<any>(this.apiURL);
  }

  informaValidacao(): Observable<InfoResponse> {
    return this.http.get<InfoResponse>(`${this.apiURL}/informa-validacao`);
  }

}
