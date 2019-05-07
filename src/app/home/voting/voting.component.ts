import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  voting: FormGroup;
  selected: any[] = [];
  listNominees = [
    {id: 1, name: 'Chuc (Gray) D. TRUONG'},
    {id: 2, name: 'Canh (Adam) V. TRUONG'},
    {id: 3, name: 'Hau (Hammer) T. PHAM'},
    {id: 4, name: 'Bao (Berny) C. BAO'},
    {id: 5, name: 'Dinh (Roger) D. LE'}
  ]
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.generateForm();
  }
  generateForm() {
    this.voting = this.formBuilder.group({
      id: 'Award Name',
      first_vote: 'Nominee Name',
      second_vote: 'Nominee Name',
      third_vote: 'Nominee Name'
    });
  }
  // after an option selected in select box
  onChange(event) {
    const id = event.target.value;
    const selected = this.listNominees.find(nominee => nominee.id === id);
    this.selected.push(selected);

  }
  onFocus(event) {

  }

}
