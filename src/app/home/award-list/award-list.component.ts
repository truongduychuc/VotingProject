import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddAwardModalComponent} from './add-award-modal/add-award-modal.component';
import {AwardService} from '../../_services/award.service';
import {GroupByPipe} from '../../_pipes/group-by.pipe';
import {User} from '../../_models/user';
import {DataSharingService} from '../../_shared/data-sharing.service';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.scss']
})
export class AwardListComponent implements OnInit {
  awardList: any[];
  currentUser: User;
  // sharedData: for transferring successfully uploading logo message from upload-logo.component
  constructor(private modalService: NgbModal, private awardService: AwardService, private groupByPipe: GroupByPipe,
              private  sharedData: DataSharingService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.sharedData.currentMessage.subscribe( success => {
      // this is the message from shared service sent after uploading logo successfully
      this.getAwardList();
    }, error1 => {
      console.log(error1);
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
    modalRef.result.then(success => {
      this.getAwardList();
    }, dismiss => {
      console.log(dismiss);
    });
  }


}
