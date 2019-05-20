import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddAwardModalComponent} from './add-award-modal/add-award-modal.component';
import {AwardService} from '../../_services/award.service';
import {GroupByPipe} from '../../_pipes/group-by.pipe';
import {User} from '../../_models/user';
import {DataSharingService} from '../../_shared/data-sharing.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-management.component.html',
  styleUrls: ['./award-management.component.scss']
})
export class AwardManagementComponent implements OnInit {
  awardList: any[];
  currentUser: User;
  // sharedData: for transferring successfully uploading logo message from upload-logo.component
  constructor(private modalService: NgbModal, private awardService: AwardService, private groupByPipe: GroupByPipe,
              private  sharedData: DataSharingService, private notifier: NotifierService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.sharedData.currentMessage.subscribe( success => {
      console.log(success);
      this.getAwardList();
    });
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
