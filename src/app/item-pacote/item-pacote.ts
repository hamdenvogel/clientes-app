import { ServicoPrestado } from './../servico-prestado/servicoPrestado';
import { Pacote } from './../pacote/pacote';
import { InfoResponse } from "../infoResponse";

export class ItemPacote {
  id: number;
  idPacote: number;
  idServicoPrestado: number;
  infoResponseDTO: InfoResponse;
}
