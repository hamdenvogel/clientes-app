import { InfoResponse } from "../infoResponse";

export class Cliente {
    id: number;
    nome: string;
    cpf: string;
    dataCadastro: string;
    pix: string;
    cep: string;
    endereco: string;
    complemento: string;
    uf: string;
    cidade: string;
    infoResponseDTO: InfoResponse;
    captcha: string;
}
