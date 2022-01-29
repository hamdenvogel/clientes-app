import { Pacote } from "../pacote/pacote";
import { Prestador } from "../prestador/prestador";
import { ServicoPrestado } from "../servico-prestado/servicoPrestado";

export class ItemPacoteBusca {
  id: number;
  pacote: Pacote;
  servicoPrestado: ServicoPrestado;
  prestador: Prestador;
}
