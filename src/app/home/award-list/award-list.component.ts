import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddAwardComponent} from "./add-award/add-award.component";

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.scss']
})
export class AwardListComponent implements OnInit {
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }
  openAddingAward() {
    this.modalService.open(AddAwardComponent, {windowClass: 'myCustomModalClass'});
  }

}
