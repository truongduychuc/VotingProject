import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddAwardModalComponent} from './add-award-modal/add-award-modal.component';
import {AwardService} from '../../_services/award.service';
import {GroupByPipe} from '../../_pipes/group-by.pipe';
import {User} from '../../_models/user';
import {DataSharingService} from '../../_shared/data-sharing.service';
import {NotifierService} from 'angular-notifier';
import {AwardType} from '../../_models/award-type';
import {Router} from '@angular/router';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import {AccountService} from '../../_services/account.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-management.component.html',
  styleUrls: ['./award-management.component.scss']
})
export class AwardManagementComponent implements OnInit, OnDestroy {
  error;
  isAlive: boolean;
  interval: number;
  awardList: any[];
  awardListSubscription: Subscription;

  awardTypesList: AwardType[];
  currentUser: User;
  currentUserSubscription: Subscription;
  currentUserLoaded = false;
  typeForSearching: number = null;

  // sharedData: for transferring successfully uploading logo message from upload-logo.component
  constructor(private modalService: NgbModal, private awardService: AwardService, private groupByPipe: GroupByPipe,
              private  sharedData: DataSharingService, private notifier: NotifierService, private router: Router,
              private accountService: AccountService) {
    this.isAlive = true;
    this.interval = 5000; // use to automatically get the award list after a while
  }

  ngOnInit() {
    this.sharedData.currentMessage.subscribe(messOfChangingLogo => {
      this.getAwardList();
    });
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.isAlive)
      .subscribe(() => {
        this.getAwardList();
      });
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser.role) {
        this.currentUserLoaded = true;
      }
    });
  }

  // get awardList at beginning
  getAwardList() {
    // reverse to display award list with descending time. The newer the award is, the higher its position is.
    this.awardListSubscription = this.awardService.getAwardList().subscribe((res) => {
      this.awardList = this.groupByPipe.transform(res.awards, 'year').reverse();
      this.awardTypesList = res.types;
    }, errGetting => {
      this.error = errGetting;
    });
  }

  // direct to the award detail page includes information of the newest award
  findAnAwardByType(): void {
    if (this.typeForSearching === null || !this.typeForSearching) {
      this.getAwardList();
    } else {
      this.awardService.findAnAwardByType(this.typeForSearching).subscribe((award) => {
        this.router.navigate([`home/award-detail/${award.id}`]).then().catch(err => {
          console.log(err);
        });
      }, error => {
        console.log(error);
        this.notifier.notify('error', error);
      });
    }
  }

  // to show the button only can be used by admin
  get isAdmin() {
    return this.currentUserLoaded && this.currentUser.role.name.toLowerCase() === 'admin';
  }

  openAddingAward() {
    const modalRef = this.modalService.open(AddAwardModalComponent, {backdrop: 'static'});
    modalRef.result.then((successMes: string) => {
      this.getAwardList();
      this.notifier.notify('info', successMes);
    });
  }

  ngOnDestroy(): void {
    this.isAlive = false;
    this.currentUserSubscription.unsubscribe();
    this.awardListSubscription.unsubscribe();
  }
}
