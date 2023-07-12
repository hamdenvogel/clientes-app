import { InfoResponse } from "../infoResponse";
import { Profissao } from "../profissao";

export class Prestador {
  id: number;
  nome: string;
  cpf: string;
  dataCadastro: string;
  pix: string;
  avaliacao: number;
  idProfissao: number;
  infoResponseDTO: InfoResponse;
  captcha: string;
  profissao: Profissao;
  email: string;
  data: number;
}
