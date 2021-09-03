import { InfoResponse } from "../infoResponse";

export class ServicoPrestado {
    id: number;
    descricao:  string;
    preco:  string;
    data: string;
    idCliente:  number;
    status: string;
    infoResponseDTO: InfoResponse;
}
