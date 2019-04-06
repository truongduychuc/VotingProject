import { Component, OnInit } from '@angular/core';
import {AccountService} from "../_services/account.service";


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  itemsPerPage = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  item: number;
  constructor(private accountService: AccountService) { }
  listOfAllEmployee = [
    {username: 'gray' ,password: '12345678', first_name: 'Chuc', last_name: 'Truong', english_name: 'Gray', email: 'gray@enclave.vn', position: 'developer', team: 'Troy'},
    {username: 'roger' ,password: '12345678', first_name: 'Dinh', last_name: 'Le', english_name: 'Roger', email: 'roger@enclave.vn', position: 'developer', team: 'Troy'}
  ];
  ngOnInit() {
  }

}
