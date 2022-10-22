import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartComponentLike, ChartConfiguration, ChartOptions } from 'chart.js';
import { easingEffects } from 'chart.js/helpers';
import { BaseChartDirective } from 'ng2-charts';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';

let totalDuration: any;
let dataLength: any;

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  private subscription: Subscription | undefined;

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
        label: 'Value',
        data: [10, 15, 5, 35, 27, 46, 30, 57, 52],
        tension: 0.5,
        borderWidth: 5,
        hoverBorderWidth: 6,
        pointRadius: 0,
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'gray'
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
        easing: 'linear',
        duration: (ctx: any) => easingEffects.easeOutQuad(ctx.index / dataLength) * totalDuration / dataLength,
        from: NaN,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return easingEffects.easeOutQuad(ctx.index / dataLength) * totalDuration;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: (ctx: any) => easingEffects.easeOutQuad(ctx.index / dataLength) * totalDuration / dataLength,
        from: (ctx: any) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return easingEffects.easeOutQuad(ctx.index / dataLength) * totalDuration;;
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
    dataLength = 9;
    totalDuration = 500;

    this.subscription = this.appService.onDarkModeUpdated.subscribe(() => {
      if (this.chart) {
        this.chart.render();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
