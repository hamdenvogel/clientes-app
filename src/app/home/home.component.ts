import { InfoService } from './../info.service';
import { TotalUsuarios } from './../clientes/totalUsuarios';
import { UsuariosService } from './../usuarios.service';
import { TotalServicos } from './../clientes/totalServicos';
import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { TotalClientes } from '../clientes/totalClientes';
import { ServicoPrestadoService } from '../servico-prestado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalClientes: TotalClientes;
  totalClientesCadastrados: number;
  totalServicos: TotalServicos;
  totalServicosCadastrados: number;
  totalUsuarios: TotalUsuarios;
  totalUsuariosCadastrados: number;
  nameApp: string;
  versionApp: string;
  authorApp: string;

  constructor(
    private clienteService: ClientesService,
    private servicosPrestadosService: ServicoPrestadoService,
    private usuarioService: UsuariosService,
    private infoService: InfoService
  ) {
    this.totalClientes = new TotalClientes();
    this.totalServicos = new TotalServicos();
    this.totalUsuarios = new TotalUsuarios();
   }

  ngOnInit(): void {
    this.clienteService
      .totalClientes()
      .subscribe(resposta => {
        this.totalClientes = resposta;
        console.log(`this.totalClientes: ${this.totalClientes.totalClientes}`);
        this.totalClientesCadastrados = this.totalClientes.totalClientes;
      });

      this.servicosPrestadosService
        .totalServicos()
        .subscribe(resposta => {
          this.totalServicos = resposta;
          console.log(`this.totalServicos: ${this.totalServicos.totalServicos}`);
          this.totalServicosCadastrados = this.totalServicos.totalServicos;
        });

        this.usuarioService
          .totalUsuarios()
          .subscribe(resposta => {
            this.totalUsuarios = resposta;
            console.log(`this.totalUsuarios: ${this.totalUsuarios.totalUsuarios}`);
            this.totalUsuariosCadastrados = this.totalUsuarios.totalUsuarios;
          });

          this.infoService
            .getInfo()
            .subscribe(resposta => {
              this.nameApp = resposta.nameApp;
              this.versionApp = resposta.versionApp;
              this.authorApp = resposta.authorApp;
            })
  }

}
