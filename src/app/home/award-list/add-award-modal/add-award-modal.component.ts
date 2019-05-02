import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award-modal.component.html',
  styleUrls: ['./add-award-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAwardModalComponent implements OnInit {
  years: number[] = [];
  nominees = [
    {id: 1, name: 'Roger'},
    {id: 2, name: 'Lisa'}
  ];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.setYearsArray();
  }
  setYearsArray() {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear - 1);
    console.log(this.years);
  }

}
