import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TeamService} from '../../../_services/team.service';
import {AwardService} from '../../../_services/award.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-award',
  templateUrl: './add-award-modal.component.html',
  styleUrls: ['./add-award-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAwardModalComponent implements OnInit {
  years: number[] = [];
  types: any[];
  nominees: any[];
  showOtherNameInput = false;
nominessMock = [
  {id: 1, name: 'Roger', team: 'Bootcamp'},
  {id: 2, name: 'Roger', team: 'Manager'},
  {id: 3, name: 'Roger', team: 'Cadet'}
];
selected: any[];
  addAward: FormGroup;
  constructor(public activeModal: NgbActiveModal, private teamService: TeamService, private awardService: AwardService) { }

  ngOnInit() {
    this.getListNominees();
    this.getAwardTypes();
    this.setYearsArray();
  }
  setYearsArray() {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
    this.years.push(currentYear - 1);
    console.log(this.years);
  }
  getListNominees() {
    this.teamService.getListForNominating().subscribe( successRes => {
      this.nominees  = successRes.data;
      console.log(this.nominees);
    }, error => {
      console.log(error);
    });
  }
  getAwardTypes() {
    this.awardService.getAwardTypes().subscribe( successRes => {
      if (!successRes.hasOwnProperty('types')) {
        console.log('The response didn\'t include \'type\' property!');
      } else {
        this.types = successRes.types;
        console.log(this.types);
      }
    }, error => {
      console.log(error);
    });
  }
  onAwardNameSelectChanged() {
    const nameSelected = (<HTMLSelectElement>document.getElementById('awardName')).value;
    console.log(nameSelected);
    if (nameSelected !== 'other') {
      this.showOtherNameInput = false;
    } else {
      this.showOtherNameInput = true;
    }
  }
}
