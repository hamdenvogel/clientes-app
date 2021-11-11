import { Prestador } from 'src/app/prestador/prestador';
import { Cliente } from '../../clientes/cliente';

export class ServicoPrestadoBusca {
    descricao: string;
    valor: number;
    data: string;
    cliente: Cliente;
    status: string;
    prestador: Prestador;
    tipo: string;
}
