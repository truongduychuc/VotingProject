import {Component, OnDestroy, OnInit} from '@angular/core';
import {AwardService} from '../../_services/award.service';
import {
  ChartColor,
  ChartData, ChartLegendLabelItem,
  ChartOptions,
  ChartTooltipItem,
  ChartType
} from 'chart.js';
import {Label} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {Award} from '../../_models/award';
import {DateFormatPipe} from '../../_pipes/date-format.pipe';
import {Router} from '@angular/router';
import {map, takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-data-tracking',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _isAlive: boolean;
  limitOfFinishes = 3;
  limitOfUpcoming = 3;
  limitOfTakingPlace = 3;
  totalFinishes: number;
  totalUpcoming: number;
  finishedAwardList: Award[];
  upcomingAwardList: Award[];
  takingPlaceAwardList: Award[];
  percentList: number[];
  nomineeNameList: Label[];
  chartTitle;
  chartTime;
  chartYear;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 13,
        fontFamily: 'Poppins',
        generateLabels(chart: Chart): ChartLegendLabelItem[] {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
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

  constructor(private awardService: AwardService, private dateFormat: DateFormatPipe, private router: Router) {
    this._isAlive = true;
  }

  ngOnInit() {
    this.getAwardList();
  }

  // get awardList at beginning
  getAwardList(): void {
    this.awardService.getAwardList()
      .pipe(
        map(res => res.awards),
        takeWhile(() => this._isAlive)
      ).subscribe(list => {
      const finishedAwards = list.filter(award => award.status === 0);
      this.totalFinishes = finishedAwards.length;
      const pendingAwards = list.filter(award => award.status === 1);
      this.totalUpcoming = pendingAwards.length;
      const takingPlaceAward = list.filter(award => award.status === 2);
      this.finishedAwardList = finishedAwards.slice(0, this.limitOfFinishes);
      this.upcomingAwardList = pendingAwards.slice(0, this.limitOfUpcoming);
      this.takingPlaceAwardList = takingPlaceAward.slice(0, this.limitOfTakingPlace);
      if (this.finishedAwardList.length > 0) {
        this.getData(this.finishedAwardList[0]);
      }
    }, errGetting => {
      console.log(errGetting);
    });
  }

  getData(award: Award): void {
    this.awardService.getRankingBreakDown(award.id).subscribe(res => {
      const slicedBreakdowns = res.data.slice(0, 3);
      const tempPercentList = slicedBreakdowns.map(breakdown => breakdown.percent);
      this.nomineeNameList = slicedBreakdowns.map(breakdown => breakdown.nominee_name.english_name);
      this.nomineeNameList.push('Others');
      const othersPercents = parseFloat((Math.round((100 - tempPercentList.reduce((preVal, currentVal) => preVal + currentVal, 0))
        * 100) / 100)
        .toFixed(2));
      tempPercentList.push(othersPercents);
      this.percentList = tempPercentList;
      this.chartTitle = award.awardType.name;
      const awardStartTime: string = this.dateFormat.transform(award.date_start);
      const awardEndTime: string = this.dateFormat.transform(award.date_end);
      this.chartTime = 'From ' + awardStartTime + ' to ' + awardEndTime;
      this.chartYear = award.year;
    }, err => {
      console.log(err);
    });
  }

  openNestedMenu(id: number) {
    if (!id) {
      return;
    }
    const submenu = <HTMLElement>document.getElementById('award' + id);
    const dropIcon = <HTMLElement>document.getElementById('drop-icon' + id);
    if (submenu.style.display === 'block') {
      submenu.style.display = 'none';
      dropIcon.classList.remove('fa-chevron-down');
      dropIcon.classList.add('fa-chevron-right');
    } else {
      submenu.style.display = 'block';
      dropIcon.classList.remove('fa-chevron-right');
      dropIcon.classList.add('fa-chevron-down');
    }
  }

  navigateToDetailPage(id: number) {
    this.router.navigate(['/home/award-detail', id]);
  }

  loadMoreFinishes(): void {
    this.limitOfFinishes += 3;
    this.getAwardList();
  }

  loadMoreUpcoming(): void {
    this.limitOfUpcoming += 3;
    this.getAwardList();
  }

  loadMoreTakingPlace(): void {
    this.limitOfTakingPlace += 3;
    this.getAwardList();
  }

  ngOnDestroy(): void {
    this._isAlive = false;
  }
}

