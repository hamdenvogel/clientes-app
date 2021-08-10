import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Info } from './info';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  apiURL: string = environment.apiURLBase + '/api/info';

  constructor( private http: HttpClient ) { }

  getInfo(): Observable<Info>{
    return this.http.get<Info>(this.apiURL);
  }
}
