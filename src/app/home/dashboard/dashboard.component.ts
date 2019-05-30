import { Component, OnInit } from '@angular/core';
import {AwardService} from '../../_services/award.service';
import {
  ChartColor,
  ChartData,
  ChartOptions,
  ChartTitleOptions,
  ChartTooltipItem,
  ChartType
} from 'chart.js';
import {Label} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-data-tracking',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  finishedAwardList: any[];
  upcomingAwardList: any[];
  percentList: number[];
  nomineeNameList: Label[];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontSize: 13,
        fontFamily: 'Poppins',
        generateLabels(chart: any): any {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map( (label, i) => {
              let labelForPlace, color: ChartColor;
              if (i === 0) {
                labelForPlace = 'First place';
                color = 'rgba(255,99,132,0.6)';
              } else {
                if (i === 1) {
                  labelForPlace = 'Second place';
                  color = 'rgba(54,162,235,0.6)';
                } else {
                  if (i === 2) {
                    labelForPlace = 'Third place';
                    color = 'rgba(255,206,86,0.6)';
                  } else {
                    labelForPlace = 'Others';
                    color = 'rgba(231,233,237,0.6)';
                  }
                }
              }
              return {
                text: labelForPlace,
                fillStyle: color
              };
            });
          }
        }
      }
    },
    title: {
      fontStyle: 'bold',
      fontSize: 20,
      fontFamily: 'Poppins'
    },
    tooltips: {
      bodyFontSize: 14,
      bodyFontFamily: 'Poppins',
      callbacks: {
        label(tooltipItem: ChartTooltipItem, data: ChartData): string | string[] {
          // get data corresponding each one and add % unit after name
          return ' ' + data.labels[tooltipItem.index] + ': '
            + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
        font: {
          family: 'Poppins'
        }
      }
    }
  };
  public title: ChartTitleOptions = {
  };
  public pieChartPlugins = [pluginDataLabels];
  public pieChartType: ChartType = 'pie';
  constructor(private awardService: AwardService) { }

  ngOnInit() {
    this.getAwardList();
    this.getData(1034);
  }
  // get awardList at beginning
  getAwardList() {
    this.awardService.getAwardList().pipe().subscribe( list => {
      const finishedAwards = list.filter(award => award.status === 0);
      const slicedAwards = finishedAwards.slice(0, 3);
      this.finishedAwardList = slicedAwards;
    }, errGetting => {
      console.log(errGetting);
    });
  }
  getSpecificAwardInfo() {
    this.awardService.getAwardDetail(1034);
  }
  getData(id: number) {
    this.awardService.getRankingBreakDown(id).subscribe(res => {
      const slicedBreakdowns = res.data.slice(0, 3);
      const tempPercentList = slicedBreakdowns.map(breakdown => breakdown.percent);
      this.nomineeNameList = slicedBreakdowns.map(breakdown => breakdown.nominee_name.english_name);
      this.nomineeNameList.push('Others');
      const othersPercents = parseFloat((Math.round ((100   - tempPercentList.reduce((a, b) => a + b, 0)) * 100) / 100).toFixed(2));
      tempPercentList.push(othersPercents);
      this.percentList = tempPercentList;
    }, err => {
      console.log(err);
    });
  }

}

