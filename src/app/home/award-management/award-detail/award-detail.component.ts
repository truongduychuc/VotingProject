import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AwardService} from '../../../_services/award.service';
import {Award} from '../../../_models/award';
import {PastWinner} from '../../../_models/past-winner';
import {User} from '../../../_models/user';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailComponent implements OnInit, OnDestroy {
  id: number;
  awardDetail: Award;
  pastWinnerList: PastWinner;
  currentUser: User;
  /*for sorting
  TABLE (Nodejs) -----|------ COLUMN (NodeJS) --------------------------------| TABLE (MySQL)
  winner--------------|------ percent ----------------------------------------| finalResults
  winner_name---------|------ first_name or last_name or english_name---------| user
  awardDetail---------|------ year--------------------------------------------| awardDetails
  */
  currentSortedColumn: string = 'year';
  currentSortedType = 'DESC';
  currentSortedTable: string = 'awardDetail';
  constructor(private route: ActivatedRoute, private awardService: AwardService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    // get id from routeLink params
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getDetail();
    this.reloadPreviousStatus();
  }
  // to show the button only can be used by admin
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
  getDetail() {
    this.awardService.getAwardDetail(this.id).subscribe((detail: Award) => {
      this.awardDetail = detail;
    }, error1 => {
      console.log(error1);
    });
  }
  reloadPreviousStatus() {
    // get params at the last times getting user list
    let lastPastWinnerParams = this.getPreviousStatus();  // if your last res is 'there is no result', it will be {}
    if (null == lastPastWinnerParams) {
      // when you open browser initially
      // load default list
      this.getPastWinners();
    } else {
      let reloadedParams = new HttpParams();
      // get last query params and append to reloadedParams

      let lastCol = lastPastWinnerParams.col;
      if (lastCol) {  // if lastCol is undefined, if(lastCol) will return false
        reloadedParams = reloadedParams.append('col', lastCol);  // it will be undefined if lastPastWinnerParams is {}
        this.currentSortedColumn = lastCol; // recover component to last status, such as previous select box's value
      }
      let lastType = lastPastWinnerParams.type;
      if (lastType) {
        reloadedParams = reloadedParams.append('type', lastPastWinnerParams.type);
        this.currentSortedType = lastType;
      }
      let lastTable = lastPastWinnerParams.table;
      if (lastTable) {
        reloadedParams = reloadedParams.append('table', lastPastWinnerParams.table);
        this.currentSortedTable = lastTable;
      }
      this.awardService.getPastWinner(this.id, reloadedParams).subscribe(
        (pastWinner: PastWinner) => {
          this.pastWinnerList = pastWinner;
          this.saveCurrentStatus(lastPastWinnerParams);
          console.log(this.pastWinnerList);
        }, (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    }

  }
  // get past winner list
  getPastWinners(sortColumn?: string, sortType?: string, sortTable?: string) {
    let params = new HttpParams();
    if (null == sortColumn && this.currentSortedColumn) {
      // if sortColumn param wasn't passed, the function will call current status of page
      sortColumn = this.currentSortedColumn;
      params = params.append('col', sortColumn);
    } else {
      if (sortColumn) {
        params = params.append('col', sortColumn); // using append need params = params*before*.append...
        console.log(sortColumn);
      }
    }
    if (null == sortType && this.currentSortedType) {
      sortType = this.currentSortedType;
      params = params.append('type', sortType);
    } else {
      if (sortType) {
        params = params.append('type', sortType);
        console.log(sortType);
      }
    }
    if (null == sortTable && this.currentSortedTable) {
      sortTable = this.currentSortedTable;
      params = params.append('table', sortTable);
    } else {
      if (sortTable) {
        params = params.append('table', sortTable);
        console.log(sortTable);
      }
    }
    this.awardService.getPastWinner(this.id, params).subscribe((pastWinner: PastWinner) => {
      this.pastWinnerList = pastWinner;
      let lastPastWinnerParams = {
        col: sortColumn,
        type: sortType,
        table: sortTable,
      };
      this.saveCurrentStatus(lastPastWinnerParams);
      console.log(lastPastWinnerParams);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }
  changeSortType() {
    if (this.currentSortedType === 'ASC') {
      this.currentSortedType = 'DESC';
    } else {
      this.currentSortedType = 'ASC';
    }
  }
  sortOnColumn(columnName: string, tableName: string) {
    if (this.currentSortedColumn === columnName && this.currentSortedTable === tableName) {
      // check if you sort at same column => change sort direction
      this.changeSortType();
    } else {
      this.currentSortedType = 'ASC';
      this.currentSortedColumn = columnName;
      this.currentSortedTable = tableName;
    }
    this.getPastWinners();
  }
  // stay on current status after reloading page
  saveCurrentStatus(lastPastWinnerParams: Object) {
    // session Storage actually get cleared as the browser is closed.
    sessionStorage.setItem('lastEmployeeParams', JSON.stringify(lastPastWinnerParams));
  }

  // try to get previous page status
  getPreviousStatus() {
    let lastPastWinnerParams = JSON.parse(sessionStorage.getItem('lastPastWinnerParams'));
    console.log(lastPastWinnerParams);
    return lastPastWinnerParams;
  }

  // remove status as route to other component in routeLinks set
  removeStatus() {
    sessionStorage.removeItem('lastPastWinnerParams');
  }
  ngOnDestroy(): void {
    this.removeStatus();
  }
}
