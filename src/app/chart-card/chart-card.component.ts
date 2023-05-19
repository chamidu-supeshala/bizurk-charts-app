import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartComponentLike, ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  private subscription: Subscription | undefined;
  private dataSets = [
    [10, 15, 5, 35, 27, 46, 30, 57, 52],
    [15, 11, 20, 22, 35, 30, 20, 32, 40],
    [52, 57, 30, 46, 27, 35, 5, 15, 10],
    [15, 11, 20, 22, 32, 16, 22, 30, 12],
    [12, 30, 22, 16, 32, 22, 20, 11, 15],
    [40, 32, 20, 30, 35, 22, 20, 11, 15],
    [52, 57, 30, 46, 27, 35, 5, 15, 10]
  ]

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      '',
      '1D',
      '5D',
      '3M',
      '6M',
      '1Y',
      '5Y',
      'MAX',
      ''
    ],
    datasets: [
      {
        label: '',
        data: [10, 15, 5, 35, 27, 46, 30, 57, 52],
        tension: 0.5,
        borderWidth: 5,
        hoverBorderWidth: 6,
        pointRadius: 0,
      },
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      tooltip: {
        enabled: false,

        external: function(context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                document.body.appendChild(tooltipEl);
            }
            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = '0';
                return;
            }
            console.log(tooltipModel.yAlign)
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            tooltipEl.classList.add(tooltipModel.yAlign);
            tooltipEl.classList.add(tooltipModel.xAlign);

            function getBody(bodyItem: any) {
                return bodyItem.lines;
            }
            if (tooltipModel.body) {
                const titleLines = tooltipModel.title || [];
                const bodyLines = tooltipModel.body.map(getBody);

                let innerHtml = '<div class="tooltip">';
                bodyLines.forEach(function(text) {
                    innerHtml += '<p>' + text + '</p>';
                });
                innerHtml += '</div>';
                let tableRoot = tooltipEl.querySelector('table');
                if (tableRoot)
                  tableRoot.innerHTML = innerHtml;
            }

            const position = context.chart.canvas.getBoundingClientRect();

            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = position.left -30 + window.pageXOffset + tooltipModel.caretX +  'px';
            tooltipEl.style.top = position.top + 10+  window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transition = 'all .3s ease';
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
          color: '#ddd',
          font: {
            size: 16,
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }
        }
      },
      y: {
        ticks: {
          display: false
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    animations: {
      x: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 100,
        from: NaN,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * 30;
        }
      },
      y: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 100,
        from: (ctx: any) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * 30;
        }
      }
    },
  };

  public lineChartPlugins: ChartComponentLike[] = [{
    id: 'plugin1',
    afterLayout: (chart: Chart, args: any, options: any) => {
      const ctx = chart.ctx;
      const gradientStroke = ctx.createLinearGradient(0, 0, 10, 400);
      const dataset = chart.data.datasets[0];
      const colors = ['#71bff0', '#71bff0', '#ff5079', '#ff5079', '#ff5079'];
      colors.forEach((c: any, i: any) => {
        var stop = 1 / (colors.length - 1) * i;
        gradientStroke.addColorStop(stop, colors[i]);
      });
      dataset.borderColor = gradientStroke;
    }
  }];

  constructor (
    public appService: AppService
  ) {}

  ngOnInit(): void {
    this.subscription = this.appService.onDarkModeUpdated.subscribe(() => {
      if (this.chart) {
        this.chart.render();
      }
    });

    this.appService.onWindowFocus.subscribe(() => {
      if (this.chart) {
        this.chart.render();
      }
    });
  }

  updateChart(index: number): void {
    this.lineChartData.datasets[0].data = this.dataSets[index];
    this.chart?.render();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
