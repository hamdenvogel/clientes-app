import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GraficoLinearAtendimento } from './graficoLinearAtendimento';
import { GraficoStatusPacotePercentual } from './graficoStatusPacotePercentual';
import { GraficoTipoServico } from './graficoTipoServico';
import { GraficoTortaAtendimento } from './graficoTortaAtendimento';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {

  apiURL: string = environment.apiURLBase + "/api/grafico";

  constructor(private http: HttpClient) {}

  statusAtendimentoPorPeriodo(): Observable<GraficoLinearAtendimento>{
    return this.http.get<GraficoLinearAtendimento>(`${this.apiURL}/grafico-status-atendimento-por-periodo`);
  }

  statusAtendimentoSomatorio(): Observable<GraficoTortaAtendimento>{
    return this.http.get<GraficoTortaAtendimento>(`${this.apiURL}/grafico-status-atendimento-quantidade`);
  }

  statusPacotePercentual(): Observable<GraficoStatusPacotePercentual>{
    return this.http.get<GraficoStatusPacotePercentual>(`${this.apiURL}/grafico-status-pacote-percentual`);
  }

  tipoServicoPorPeriodo(): Observable<GraficoTipoServico>{
    return this.http.get<GraficoTipoServico>(`${this.apiURL}/grafico-tipo-servico`);
  }
}
