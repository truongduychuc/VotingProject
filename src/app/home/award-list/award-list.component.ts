import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddAwardModalComponent} from "./add-award-modal/add-award-modal.component";
import {AwardService} from "../../_services/award.service";
import {GroupByPipe} from "../../_pipes/group-by.pipe";
import {User} from "../../_models/user";

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.scss']
})
export class AwardListComponent implements OnInit {
  awardList: any[];
  constructor(private modalService: NgbModal, private awardService: AwardService, private groupByPipe: GroupByPipe) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  // for determining whether the current user is admin
  currentUser: User;
  ngOnInit() {
    this.awardService.getAwardList().subscribe( list => {
       this.awardList = this.groupByPipe.transform(list, 'year').reverse();
    }, errGetting => {
      console.log(errGetting);
    })
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
  openAddingAward() {
    this.modalService.open(AddAwardModalComponent, {windowClass: 'myCustomModalClass'});
  }


}
