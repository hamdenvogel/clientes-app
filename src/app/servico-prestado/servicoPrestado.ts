import { Natureza } from './../natureza';
import { InfoResponse } from "../infoResponse";
import { Prestador } from "../prestador/prestador";

export class ServicoPrestado {
    id: number;
    descricao: string;
    preco: string;
    data: string;
    idCliente: number;
    status: string;
    infoResponseDTO: InfoResponse;
    captcha: string;
    idPrestador: number;
    prestador: Prestador;
    tipo: string;
    idNatureza: number;
    natureza: Natureza;
    checked: boolean;
    clienteNome: string;
    dataServico: number;
}
