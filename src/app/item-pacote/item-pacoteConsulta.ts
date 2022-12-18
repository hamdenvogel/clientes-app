import { ServicoPrestado } from 'src/app/servico-prestado/servicoPrestado';
import { Pacote } from './../pacote/pacote';
export class ItemPacoteConsulta {
  id: number;
  pacote: Pacote;
  servicoPrestado: ServicoPrestado;
}
