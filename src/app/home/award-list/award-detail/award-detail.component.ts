import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {AwardService} from '../../../_services/award.service';
import {Award} from '../../../_models/award';
import {PastWinner} from '../../../_models/past-winner';

@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailComponent implements OnInit {
  id: number;
  awardDetail: Award;
  pastWinnerList: PastWinner;


  constructor(private route: ActivatedRoute, private router: Router, private awardService: AwardService) {}
  ngOnInit() {
    // get id from routeLink params
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getDetail();
    this.getPastWinner();
  }
  getDetail() {
    this.awardService.getAwardDetail(this.id).subscribe((detail:Award) => {
      this.awardDetail = detail;
    }, error1 => {
      console.log(error1);
    });
  }
  // get past winner list
  getPastWinner() {
    this.awardService.getPastWinner(this.id).subscribe((pastWinner: PastWinner) => {
      this.pastWinnerList = pastWinner;
    });
  }

}
