import { InfoResponse } from "../infoResponse";

export class Pacote {
  id: number;
  descricao: string;
  justificativa: string;
  data: string;
  data_previsao: string;
  data_conclusao: string;
  status: string;
  infoResponseDTO: InfoResponse;
}
