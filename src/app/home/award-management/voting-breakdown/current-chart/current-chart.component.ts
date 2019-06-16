import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AwardService} from '../../../../_services/award.service';
import {
  ChartColor,
  ChartData,
  ChartOptions,
  ChartTooltipItem,
  ChartType
} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {Award} from '../../../../_models/award';
import {Label} from 'ng2-charts';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
@Component({
  selector: 'app-current-chart',
  templateUrl: './current-chart.component.html',
  styleUrls: ['./current-chart.component.scss']
})
export class CurrentChartComponent implements OnInit, OnDestroy {
  id: number;
  awardInfo: Award;
  percentList: number[];
  nomineeNameList: Label[];
  isAlive: boolean;
  interval: number;
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
  public pieChartPlugins = [pluginDataLabels];
  public pieChartType: ChartType = 'pie';
  constructor(private route: ActivatedRoute, private awardService: AwardService) {
    this.isAlive = true;
    this.interval = 5000;
  }

  ngOnInit() {
    this.id = parseInt(this.route.parent.snapshot.paramMap.get('id'));
    this.getAwardInfo();
    this.getData();
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.isAlive)
      .subscribe(() => {
        this.getData();
      });
  }
  getAwardInfo() {
    this.awardService.getAwardDetail(this.id).subscribe(award => {
      this.awardInfo = award;
    }, error => {
      console.log(error);
    });
  }
  // at first, get the array of breakdown belongs to this award
  // second, use map method to create the new arrays consist of the points of nominees
  // At the same time, work out the points of other nominees and push it to the array pointList
  getData() {
    this.awardService.getRankingBreakDown(this.id).subscribe(res => {
      const points = res.data.map(breakdown => breakdown.total_points);
      // add up total points of the whole award
      const awardTotalPoints = points.reduce((previousVal, currentVal) => previousVal + currentVal);
      // get three highest ranking people
      const slicedBreakdowns = res.data.slice(0, 3);
      // create an array of points
      const tempPointList = slicedBreakdowns.map(breakdown => breakdown.total_points);
      const tempPercentList = tempPointList.map(
        point => parseFloat((Math.round (((point / awardTotalPoints) * 100) * 100 ) / 100).toFixed(2))
      );
      const othersPercent = parseFloat((Math.round((100 - tempPercentList.reduce((previousVal, currentVal) => previousVal + currentVal)) * 100) / 100).toFixed(2));
      tempPercentList.push(othersPercent);
      // get nominee names and make it become an array which responsibility for being label of chart
      this.nomineeNameList = slicedBreakdowns.map(breakdown => breakdown.nominee_name.english_name);
      this.nomineeNameList.push('Others');
      // work out the amount of points the rest nominees have
      this.percentList = tempPercentList;
      // console.log(this.nomineeNameList);
      // console.log(this.percentList);
      console.log('Just got data successfully!');
    }, err => {
      console.log(err);
    });
  }
  get cssBadgeClass() {
    if (this.awardInfo.status === 0) {
      return 'badge-info';
    }
    if (this.awardInfo.status === 1) {
      return 'badge-warning';
    }
    if (this.awardInfo.status === 2) {
      return 'badge-success';
    }
  }
  get statusName() {
    if (this.awardInfo.status === 0) {
      return 'Finished';
    }
    if (this.awardInfo.status === 1) {
      return 'Pending';
    }
    if (this.awardInfo.status === 2) {
      return 'Voting';
    }
  }
  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
