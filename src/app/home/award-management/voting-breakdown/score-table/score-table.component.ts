import {Component, OnDestroy, OnInit} from '@angular/core';
import {Award} from '../../../../_models/award';
import {AwardService} from '../../../../_services/award.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit, OnDestroy {
  id: number; // id of award
  awardInfo: Award;
  breakdownList: any[];
  // for sorting and searching
  /*
  TABLE (Nodejs) -----|------ COLUMN (NodeJS) --------------------------------                                      | TABLE (MySQL)
  votingBreakdown--------------|------ rank, first_vote, second_vote, third_vote, total_points---------------------| finalResults
  nominee_name---------|------ first_name or last_name or english_name---------                                      | user
  */
  currentPage = 1;
  currentPageSize = 10;
  currentSearchText: string;
  currentSortedColumn: string = 'rank';
  currentSortedType = 'ASC';
  currentSortedTable: string = 'votingBreakdown';
  totalRecords: number;   // total number of Users
  currentRecords: number; // amount of records filtered
  itemsPerPageArr = [2, 5, 10, 15, 20, 25];
  error: any;
  previousSearchText: string;
  isAlive: boolean;
  interval: number;
  constructor(private awardService: AwardService, private route: ActivatedRoute, private router: Router) {
    this.isAlive = true;
    this.interval = 5000;
  }

  ngOnInit() {
    // get id from routeLink params
    this.id = parseInt(this.route.parent.snapshot.paramMap.get('id'));
    this.getAwardInfo();
    this.reloadPreviousStatus();
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.isAlive)
      .subscribe(() => {
        this.getBreakdown();
      });
  }
  getAwardInfo() {
    this.awardService.getAwardDetail(this.id).subscribe(award => {
      this.awardInfo = award;
    }, error1 => {
      console.log(error1);
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
  getBreakdown(sortColumn?: string, sortType?: string, sortTable?: string, searchText?: string, itemsPerPage?: number, currentPage?: number) {
    let params = new HttpParams();
    if (null == sortColumn && this.currentSortedColumn) {
      // if sortColumn param wasn't passed, the function will call current status of page
      sortColumn = this.currentSortedColumn;
      params = params.append('col', sortColumn);
    } else {
      if (sortColumn) {
        params = params.append('col', sortColumn); // using append need params = params*before*.append...
        // console.log(sortColumn);
      }
    }
    if(null == sortType && this.currentSortedType) {
      sortType = this.currentSortedType;
      params = params.append('type', sortType);
    } else {
      if (sortType) {
        params = params.append('type', sortType);
        // console.log(sortType);
      }
    }
    if (null == sortTable && this.currentSortedTable) {
      sortTable = this.currentSortedTable;
      params = params.append('table', sortTable);
    } else {
      if (sortTable) {
        params = params.append('table', sortTable);
        // console.log(sortTable);
      }
    }
    if (null == searchText && this.currentSearchText) {
      searchText = this.currentSearchText;
      params = params.append('search', searchText);
    } else {
      if (searchText) {
        params = params.append('search', searchText);
        // console.log(searchText);
      }
    }
    if (null == itemsPerPage && this.currentPageSize) {
      itemsPerPage = this.currentPageSize;
      params = params.append('count', itemsPerPage.toString());
    } else {
      if (itemsPerPage) {
        params = params.append('count', itemsPerPage.toString());
        // console.log(itemsPerPage);
      }
    }
    if (null == currentPage && this.currentPage) {
      currentPage = this.currentPage;
      params = params.append('page', currentPage.toString());
    } else {
      if (currentPage) {
        // console.log(currentPage);
        params = params.append('page', currentPage.toString());
      }
    }
    this.awardService.getRankingBreakDown(this.id, params).subscribe( (successRes: any) => {
      if (!successRes.hasOwnProperty('data')) {
        console.log('There is no property \'data\' in response');
      } else {
        this.breakdownList = successRes.data;
        this.totalRecords = successRes.total_counts;
        if (!successRes.filtered_counts) {
          this.currentRecords = this.totalRecords;
        } else {
          this.currentRecords = successRes.filtered_counts;
        }
        // console.log(this.totalRecords);
        let lastBreakdownParams = {
          col: sortColumn,
          type: sortType,
          table: sortTable,
          search: searchText,
          count: itemsPerPage,
          page: currentPage
        };
        this.saveCurrentStatus(lastBreakdownParams);
        // console.log(successRes);
      }
    }, errGettingBreakdown => {
      if ( typeof errGettingBreakdown === 'string') {
        this.error = errGettingBreakdown;
      }
    });
  }
  pageChange(newPage: number) {
    // this function is called before the current page is changed to new page, so here need to take user list of newPage
    // console.log(this.currentPage);
    this.getBreakdown(this.currentSortedColumn, this.currentSortedType, this.currentSortedTable, this.currentSearchText,
      this.currentPageSize, newPage);
  }
  reloadPreviousStatus() {
    // get params at the last times getting user list
    let lastBreakdownParams = this.getPreviousStatus();  // if your last res is 'there is no result', it will be {}
    if (null == lastBreakdownParams) {   // when you open browser initially
      // load default list
      this.getBreakdown();
    } else {
      let reloadedParams = new HttpParams();
      // get last query params and append to reloadedParams

      let lastCol = lastBreakdownParams.col;
      if (lastCol) {  // if lastCol is undefined, if(lastCol) will return false
        reloadedParams = reloadedParams.append('col', lastCol);  // it will be undefined if lastBreakdownParams is {}
        this.currentSortedColumn = lastCol; // recover component to last status, such as previous select box's value
      }
      let lastType = lastBreakdownParams.type;
      if (lastType) {
        reloadedParams = reloadedParams.append('type', lastBreakdownParams.type);
        this.currentSortedType = lastType;
      }
      let lastTable = lastBreakdownParams.table;
      if (lastTable) {
        reloadedParams = reloadedParams.append('table', lastBreakdownParams.table);
        this.currentSortedTable = lastTable;
      }
      let lastSearch = lastBreakdownParams.search;
      if (lastSearch) {
        reloadedParams = reloadedParams.append('search', lastBreakdownParams.search);
        this.currentSearchText = lastSearch;
      }
      let lastCount = lastBreakdownParams.count;
      if (lastCount) {
        reloadedParams = reloadedParams.append('count', lastBreakdownParams.count);
        this.currentPageSize = lastCount;
      }
      let lastPage = lastBreakdownParams.page;
      if (lastPage) {
        reloadedParams = reloadedParams.append('page', lastBreakdownParams.page);
        this.currentPage = lastPage;
      }
      this.awardService.getRankingBreakDown(this.id, reloadedParams).subscribe(
        (res: any) => {
          if (!res.hasOwnProperty('data')) {
            console.log('No data in response!');
          } else {
            this.breakdownList = res.data;
            this.totalRecords = res.total_counts;
            if (!res.filtered_counts) {
              this.currentRecords = this.totalRecords;
            } else {
              this.currentRecords = res.filtered_counts;
            }
            this.saveCurrentStatus(lastBreakdownParams);
          }
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.error = err;
        }
      );
    }

  }
  // for search input
  searchOnText() {
    if (this.currentSearchText === this.previousSearchText) {
      return;
    }
    this.error = undefined;
    this.getBreakdown();
    this.previousSearchText = this.currentSearchText;
  }

  // change sort direction
  changeSortType() {
    if (this.currentSortedType === 'ASC') {
      this.currentSortedType = 'DESC';
    } else {
      this.currentSortedType = 'ASC';
    }
  }

  // sort on Column Name, if column belongs to tableName
  sortOnColumn(columnName: string, tableName: string) {
    if (this.currentSortedColumn === columnName && this.currentSortedTable === tableName) {
      // check if you sort at same column => change sort direction
      this.changeSortType();
    } else {
      this.currentSortedType = 'ASC';
      this.currentSortedColumn = columnName;
      this.currentSortedTable = tableName;
    }
    this.getBreakdown();
  }
  // called when select box's value changed
  onChangeItemsPerPage() {
    this.getBreakdown();
  }

  // stay on current status after reloading page
  saveCurrentStatus(lastBreakdownParams: Object) {
    // session Storage actually get cleared as the browser is closed.
    sessionStorage.setItem('lastBreakdownParams', JSON.stringify(lastBreakdownParams));
  }

  // try to get previous page status
  getPreviousStatus() {
    let lastBreakdownParams = JSON.parse(sessionStorage.getItem('lastBreakdownParams'));
    // console.log(lastBreakdownParams);
    return lastBreakdownParams;
  }

  // remove status as route to other component in routeLinks set
  removeStatus() {
    sessionStorage.removeItem('lastBreakdownParams');
  }
  ngOnDestroy(): void {
    this.removeStatus();
    this.isAlive = false;
  }

}
