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
  listAwards: any[];
  listNominees: any[];
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
  // after an option selected in select box, deleting the option chosen out of the list
  onChange(event) {
    const id = event.target.value;
    let index = this.listNominees.findIndex(nominee => nominee.id === id);
    console.log(index);
    if (index === -1) {
      console.log('Error when find the nominee in the list!');
    } else {
      // index here is the index which the nominee was save in nominee list, we use it to save its old position
      this.selected.push({element: this.listNominees[index], index: index});
      this.listNominees.splice(index, 1);
    }
  }
  onFocus(event) {
    const id = event.target.value;
    // find the current value of select box in the selected array
    const indexSelected = this.selected.findIndex(data => data.element.id === id );
    if ( indexSelected === -1) {
      console.log('Error when find the element!');
    } else {
      this.listNominees.splice(this.selected[indexSelected].index, 0, this.selected[indexSelected].element);
      this.selected.splice(indexSelected, 1);
    }
  }

}
