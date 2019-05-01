import {Component, Input, OnInit} from '@angular/core';
import {Nominee} from "../../../_models/nominee";

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit {
  @Input() awardId: number;
  @Input() awardName: string;
  @Input() year: number;
  @Input() status: boolean;
  @Input() description: string;
  @Input() nominees: Nominee[];
  @Input() nominee: Nominee;
  @Input() dateStart: Date;
  @Input() dateEnd: Date;
  @Input() prize: string;
  @Input() item: string;
  @Input() awardLogoURL: string;

  serverURL = 'http://localhost:4000/';
  constructor() { }

  ngOnInit() {
  }

}
