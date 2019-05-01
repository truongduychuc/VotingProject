import {Component, Input, OnInit} from '@angular/core';
import {Award} from "../../../_models/award";

@Component({
  selector: 'app-award-as-year',
  templateUrl: './award-as-year.component.html',
  styleUrls: ['./award-as-year.component.scss']
})
export class AwardAsYearComponent implements OnInit {
  isCollapsed: false;
  @Input() year: number;
  @Input() awardListOfYear: Award[] = [];
  constructor() { }

  ngOnInit() {
  }

}
