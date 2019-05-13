import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AwardService} from '../../../_services/award.service';
import {Award} from '../../../_models/award';
import {PastWinner} from '../../../_models/past-winner';
import {User} from '../../../_models/user';

@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailComponent implements OnInit {
  id: number;
  awardDetail: Award;
  pastWinnerList: PastWinner;
  currentUser: User;
  constructor(private route: ActivatedRoute, private router: Router, private awardService: AwardService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    // get id from routeLink params
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getDetail();
    this.getPastWinner();
  }
  // to show the button only can be used by admin
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
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
