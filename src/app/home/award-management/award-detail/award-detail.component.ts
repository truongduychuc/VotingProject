import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AwardService} from '../../../_services/award.service';
import {Award} from '../../../_models/award';
import {PastWinner} from '../../../_models/past-winner';
import {User} from '../../../_models/user';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Winner} from '../../../_models/winner';
import {AccountService} from '../../../_services/account.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditingAwardModalComponent} from '../editing-award-modal/editing-award-modal.component';
import {NotifierService} from 'angular-notifier';
import {DataSharingService} from '../../../_shared/data-sharing.service';
import {map, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';


type PreviousParams = {
  col: string,
  type: string,
  table: string
};

@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailComponent implements OnInit, OnDestroy {
  serverURL = environment.serverUrl;
  id: number;
  awardDetail: Award;
  pastWinnerList: PastWinner;
  currentUser: User;
  currentUserLoaded = false;
  nomineeList: any[];
  winner: Winner;
  countDown: number;
  loadedDetail = false;
  subscription: Subscription = new Subscription();

  isTimerCountDownOpened = true;
  /*for sorting
  TABLE (Nodejs) -----|------ COLUMN (NodeJS) --------------------------------| TABLE (MySQL)
  winner--------------|------ percent ----------------------------------------| finalResults
  winner_name---------|------ first_name or last_name or english_name---------| user
  awardDetail---------|------ year--------------------------------------------| awardDetails
  */
  currentSortedColumn = 'year';
  currentSortedType = 'DESC';
  currentSortedTable = 'awardDetail';

  // for the slide
  customOptions: any = {
    loop: false,
    margin: 50,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      250: {
        items: 2
      },
      550: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false,
    /*  autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true*/
  };

  constructor(private route: ActivatedRoute, private awardService: AwardService, private accountService: AccountService,
              private modalService: NgbModal, private notifier: NotifierService, private sharedData: DataSharingService) {

  }

  ngOnInit() {
    this.getCurrentUser();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getDetail();
    this.getNomineeList();
    this.reloadPreviousStatus();
    this.sharedData.currentMessage.subscribe(() => {
      this.getNomineeList();
    });
  }

  getCurrentUser(): void {
    this.subscription.add(
      this.accountService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.currentUserLoaded = true;
      }));
  }

  // to show the button only can be used by admin
  get isAdmin(): boolean {
    return this.currentUserLoaded && this.currentUser.role.name.toLowerCase() === 'admin';
  }

  getCssBadgeClass(status: number): string {
    if (status === 0) {
      return 'badge-info';
    }
    if (status === 1) {
      return 'badge-warning';
    }
    if (status === 2) {
      return 'badge-success';
    }
  }

  getStatusName(status: number): string {
    if (status === 0) {
      return 'Finished';
    }
    if (status === 1) {
      return 'Pending';
    }
    if (status === 2) {
      return 'Voting';
    }
  }

  getDetail(): void {
    this.route.params
      .pipe(
        map(v => v.id),
        switchMap(id => this.awardService.getAwardDetail(id))
      ).subscribe(detail => {
      this.awardDetail = detail;
      this.loadedDetail = true;
      if (this.loadedDetail && this.awardDetail.status === 0) {
        this.getWinner();
      }
      this.updateBreakdown();
    }, error => {
      console.log(error);
    });
  }

  reloadPreviousStatus(): void {
    // get params at the last times getting user list
    const lastPastWinnerParams = this.getPreviousStatus();  // if your last res is 'there is no result', it will be {}
    if (null == lastPastWinnerParams) {
      // when you open browser initially
      // load default list
      this.getPastWinners();
    } else {
      let reloadedParams = new HttpParams();
      // get last query params and append to reloadedParams

      const lastCol = lastPastWinnerParams.col;
      if (lastCol) {  // if lastCol is undefined, if(lastCol) will return false
        reloadedParams = reloadedParams.append('col', lastCol);  // it will be undefined if lastPastWinnerParams is {}
        this.currentSortedColumn = lastCol; // recover component to last status, such as previous select box's value
      }
      const lastType = lastPastWinnerParams.type;
      if (lastType) {
        reloadedParams = reloadedParams.append('type', lastPastWinnerParams.type);
        this.currentSortedType = lastType;
      }
      const lastTable = lastPastWinnerParams.table;
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
  getPastWinners(sortColumn?: string, sortType?: string, sortTable?: string): void {
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
      const lastPastWinnerParams = {
        col: sortColumn,
        type: sortType,
        table: sortTable,
      };
      this.saveCurrentStatus(lastPastWinnerParams);
      // console.log(lastPastWinnerParams);
    }, (err: HttpErrorResponse) => {
      // console.log(err);
    });
  }

  changeSortType(): void {
    if (this.currentSortedType === 'ASC') {
      this.currentSortedType = 'DESC';
    } else {
      this.currentSortedType = 'ASC';
    }
  }

  // get winner if the award is finished
  getWinner(): void {
    // check if the award have not finished yet
    this.awardService.getWinner(this.id).subscribe(winner => {
      this.winner = winner;
      console.log(winner);
    });
  }

  sortOnColumn(columnName: string, tableName: string): void {
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

  getNomineeList(): void {
    this.accountService.getListNomineesForVoting(this.id).subscribe(nominees => {
      if (!nominees[0].hasOwnProperty('nominee_name_1')) {
        console.log('Error in nominee_name_1');
      } else {
        this.nomineeList = nominees;
      }
    });
  }

  // update voting breakdown
  updateBreakdown(): void {
    if (this.awardDetail.status === 2) {
      this.awardService.updateVotingResult(this.id).subscribe(() => {
      }, error => {
        console.log(error);
      });
    }
  }

  openEditingAwardModal(awardId: number): void {
    const modalRef = this.modalService.open(EditingAwardModalComponent);
    modalRef.componentInstance.awardId = awardId;
    modalRef.result.then(successMes => {
      this.notifier.notify('info', successMes);
    }, dismiss => {
      // console.log(dismiss);
    });
  }

  // finish award before the end date
  finishAward() {
    this.awardService.finishAward(this.awardDetail.id).subscribe(() => {
      this.notifier.notify('info', 'Award finished successfully!');
      this.updateBreakdown();
      this.getDetail();
      this.getWinner();
      this.getNomineeList();
    }, error => {
      this.notifier.notify('error', 'Error when finishing award!');
      console.log(error);
    });
  }

  zeroTimerTrigger() {
    this.getDetail();
  }

  openTimer() {
    const timerContainer = document.getElementsByClassName('timer-container')[0];
    if (timerContainer.classList.contains('opened')) {
      timerContainer.classList.remove('opened');
      this.isTimerCountDownOpened = false;
    } else {
      timerContainer.classList.add('opened');
      this.isTimerCountDownOpened = true;
    }
  }

  // stay on current status after reloading page
  saveCurrentStatus(lastPastWinnerParams: Object): void {
    // session Storage actually get cleared as the browser is closed.
    sessionStorage.setItem('lastPastWinnerParams', JSON.stringify(lastPastWinnerParams));
  }

  // try to get previous page status
  getPreviousStatus(): PreviousParams {
    return JSON.parse(sessionStorage.getItem('lastPastWinnerParams'));
  }

  // remove status as route to other component in routeLinks set
  removeStatus(): void {
    sessionStorage.removeItem('lastPastWinnerParams');
  }

  ngOnDestroy(): void {
    this.removeStatus();

  }
}
