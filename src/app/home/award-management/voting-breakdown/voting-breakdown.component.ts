import { Component, OnInit } from '@angular/core';
import {AwardService} from '../../../_services/award.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-voting-breakdown',
  templateUrl: './voting-breakdown.component.html',
  styleUrls: ['./voting-breakdown.component.scss']
})
export class VotingBreakdownComponent implements OnInit {
  id: number; // id of award
  breakdownList: any[];
  constructor(private awardService: AwardService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // get id from routeLink params
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getBreakdown();
  }
  getBreakdown() {
    this.awardService.getRankingBreakDown(this.id).subscribe( (successRes: any) => {
      if (!successRes.hasOwnProperty('data')) {
        console.log('There is no property \'data\' in response');
      } else {
        this.breakdownList = successRes.data;
      }
    }, errGettingBreakdown => {
      console.log(errGettingBreakdown);
    });
  }

}
