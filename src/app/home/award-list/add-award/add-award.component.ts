import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award.component.html',
  styleUrls: ['./add-award.component.scss']
})
export class AddAwardComponent implements OnInit {
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
