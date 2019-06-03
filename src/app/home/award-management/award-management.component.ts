import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddAwardModalComponent} from './add-award-modal/add-award-modal.component';
import {AwardService} from '../../_services/award.service';
import {GroupByPipe} from '../../_pipes/group-by.pipe';
import {User} from '../../_models/user';
import {DataSharingService} from '../../_shared/data-sharing.service';
import {NotifierService} from 'angular-notifier';
import {AwardType} from '../../_models/award-type';
import {Router} from '@angular/router';
import {Award} from '../../_models/award';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-management.component.html',
  styleUrls: ['./award-management.component.scss']
})
export class AwardManagementComponent implements OnInit {
  awardList: any[];
  awardTypesList: AwardType[];
  currentUser: User;
  typeForSearching: number = null;
  // sharedData: for transferring successfully uploading logo message from upload-logo.component
  constructor(private modalService: NgbModal, private awardService: AwardService, private groupByPipe: GroupByPipe,
              private  sharedData: DataSharingService, private notifier: NotifierService, private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.sharedData.currentMessage.subscribe( messOfChangingLogo => {
      this.getAwardList();
    });
    this.getAwardTypesList();
  }
  // get awardList at beginning
  getAwardList() {
    // reverse to display award list with descending time. The newer the award is, the higher its position is.
    this.awardService.getAwardList().subscribe( list => {
      this.awardList = this.groupByPipe.transform(list, 'year').reverse();
    }, errGetting => {
      console.log(errGetting);
    });
  }
  // direct to the award detail page includes information of the newest award
  findAnAwardByType() {
    if (this.typeForSearching === null || !this.typeForSearching) {
      this.getAwardList();
    } else {
      this.awardService.findAnAwardByType(this.typeForSearching).pipe(tap((award: Award) => {
        this.router.navigate([`home/award-detail/${award.id}`]);
      })).subscribe(() => {}, error => {
        this.notifier.notify('error', 'This award is never happened!');
      });
    }
  }
  getAwardTypesList() {
    this.awardService.getAwardTypes().subscribe(successRes => {
      if (!successRes.hasOwnProperty('types')) {
        console.log('There is no types property in the response!');
      } else {
        this.awardTypesList = successRes.types;
      }
    }, err => {
      console.log(err);
    });
  }
  // to show the button only can be used by admin
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
  openAddingAward() {
    const modalRef =  this.modalService.open(AddAwardModalComponent, {windowClass: 'myCustomModalClass', backdrop: 'static'});
    modalRef.result.then((successMes: string) => {
      this.getAwardList();
      this.notifier.notify('info', successMes);
    }, dismissReason => {
      // console.log(dismiss);
    });
  }


}
