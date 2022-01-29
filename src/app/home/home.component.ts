import { PacoteService } from './../pacote.service';
import { TotalPacotes } from './../pacote/totalPacotes';
import { ValorPercentual } from './../valorPercentual';
import { GraficoStatusPacotePercentual } from './../graficoStatusPacotePercentual';
import { PrestadorService } from './../prestador.service';
import { GraficoService } from './../grafico.service';
import { InfoService } from './../info.service';
import { TotalUsuarios } from './../clientes/totalUsuarios';
import { UsuariosService } from './../usuarios.service';
import { TotalServicos } from './../clientes/totalServicos';
import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../clientes.service';
import { TotalClientes } from '../clientes/totalClientes';
import { ServicoPrestadoService } from '../servico-prestado.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { TotalPrestadores } from '../prestador/totalPrestadores';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  valorPercentual: ValorPercentual[];
  graficoStatusPacotePercentual:  GraficoStatusPacotePercentual;
  totalClientes: TotalClientes;
  totalClientesCadastrados: number;
  totalServicos: TotalServicos;
  totalServicosCadastrados: number;
  totalUsuarios: TotalUsuarios;
  totalUsuariosCadastrados: number;
  totalPrestadores: TotalPrestadores;
  totalPrestadoresCadastrados: number;
  totalPacotes: TotalPacotes;
  totalPacotesCadastrados: number;
  nameApp: string;
  versionApp: string;
  authorApp: string;

  barChartLabels: Label[];
  barChartData: ChartDataSets[] = [];
  barChartOptions: ChartOptions = {
    responsive: true
  };
  barChartPlugins = [];
  barChartLegend = true;
  // Define type of chart
  barChartType = 'bar';

  //Labels shown on the x-axis
  lineChartLabels: Label[];
  lineChartData: ChartDataSets[] = [];
  // Define chart options
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  // Define colors of chart segments
  lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
    }
  ];
  // Set true to show legends
  lineChartLegend = true;
  // Define type of chart
  lineChartType = 'line';
  lineChartPlugins = [];

  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: Label[];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartColors: Array < any > = [{
    backgroundColor: ['#fc5858', '#19d863', '#fdf57d'],
    borderColor: ['rgba(252, 235, 89, 0.2)', 'rgba(77, 152, 202, 0.2)', 'rgba(241, 107, 119, 0.2)']
  }];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  constructor(
    private clienteService: ClientesService,
    private servicosPrestadosService: ServicoPrestadoService,
    private usuarioService: UsuariosService,
    private infoService: InfoService,
    private graficoService: GraficoService,
    private prestadorService: PrestadorService,
    private pacoteService: PacoteService
  ) {
    this.totalClientes = new TotalClientes();
    this.totalServicos = new TotalServicos();
    this.totalUsuarios = new TotalUsuarios();
    this.totalPrestadores = new TotalPrestadores();
    this.totalPacotes = new TotalPacotes();
    this.graficoStatusPacotePercentual = new GraficoStatusPacotePercentual();
   }

  ngOnInit(): void {
    this.clienteService
      .totalClientes()
      .subscribe(resposta => {
        this.totalClientes = resposta;
        //console.log(`this.totalClientes: ${this.totalClientes.totalClientes}`);
        this.totalClientesCadastrados = this.totalClientes.totalClientes;
      });

    this.servicosPrestadosService
      .totalServicos()
      .subscribe(resposta => {
        this.totalServicos = resposta;
        this.totalServicosCadastrados = this.totalServicos.totalServicos;
      });

    this.usuarioService
      .totalUsuarios()
      .subscribe(resposta => {
        this.totalUsuarios = resposta;
        this.totalUsuariosCadastrados = this.totalUsuarios.totalUsuarios;
      });

    this.prestadorService
      .totalPrestadores()
      .subscribe(resposta => {
        this.totalPrestadores = resposta;
        this.totalPrestadoresCadastrados = this.totalPrestadores.totalPrestadores;
      });

    this.pacoteService
      .totalPacotes()
      .subscribe(resposta => {
        this.totalPacotes = resposta;
        this.totalPacotesCadastrados = this.totalPacotes.totalPacotes;
      })

    this.infoService
      .getInfo()
      .subscribe(resposta => {
        this.nameApp = resposta.nameApp;
        this.versionApp = resposta.versionApp;
        this.authorApp = resposta.authorApp;
      });

    this.graficoService
      .statusAtendimentoPorPeriodo()
      .subscribe(resposta => {
        this.lineChartLabels = resposta.mes_ano;
        this.lineChartData = [{
              data: resposta.em_atendimento,
              label: 'Em Atendimento'
          },
          {
              data: resposta.finalizado,
              label: 'Finalizado'
          },
          {
              data: resposta.cancelado,
              label: 'Cancelado'
          }
      ];
  });

    this.graficoService
      .statusAtendimentoSomatorio()
      .subscribe(resposta => {
          this.pieChartLabels = resposta.status_atendimento;
          this.pieChartData = resposta.quantidade;
      });

    this.graficoService
      .statusPacotePercentual()
      .subscribe(resposta => {
        this.valorPercentual = [];
        this.graficoStatusPacotePercentual = resposta;

        this.valorPercentual.push({"PERCENTUAL": this.graficoStatusPacotePercentual.a_percentual,
            "STATUS": "Aguardando Atendimento", "corSelecionada": "#ED7D31"});

        this.valorPercentual.push({"PERCENTUAL": this.graficoStatusPacotePercentual.i_percentual,
            "STATUS": "Iniciado", "corSelecionada": "#EED60E"});

        this.valorPercentual.push({"PERCENTUAL": this.graficoStatusPacotePercentual.e_percentual,
            "STATUS": "Em Atendimento", "corSelecionada": "#0EEEEB"});

        this.valorPercentual.push({"PERCENTUAL": this.graficoStatusPacotePercentual.c_percentual,
            "STATUS": "Cancelado", "corSelecionada": "#EB77A3"});

        this.valorPercentual.push({"PERCENTUAL": this.graficoStatusPacotePercentual.f_percentual,
            "STATUS": "Finalizado", "corSelecionada": "#555555"});

      });

    this.graficoService
      .tipoServicoPorPeriodo()
      .subscribe(resposta => {
        this.barChartLabels = resposta.mes_ano;
        this.barChartData = [{
              data: resposta.unitario,
              label: 'Unit�rio'
          },
          {
              data: resposta.pacote,
              label: 'Pacote'
          }
      ];
  });


  }

}
