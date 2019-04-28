import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award-modal.component.html',
  styleUrls: ['./add-award-modal.component.scss']
})
export class AddAwardModalComponent implements OnInit {
  years: number[] = [];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.setYearsArray();
  }
  setYearsArray() {
    let currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear-1);
    console.log(this.years);
  }

}
