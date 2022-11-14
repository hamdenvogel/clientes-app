import { ServicoPrestado } from './servico-prestado/servicoPrestado';
import { Pacote } from "./pacote/pacote";

export class ItemPacote {
  id: number;
  pacote: Pacote;
  servicoPrestado: ServicoPrestado;
}
