import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-editing-award-modal',
  templateUrl: './editing-award-modal.component.html',
  styleUrls: ['./editing-award-modal.component.scss']
})
export class EditingAwardModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
