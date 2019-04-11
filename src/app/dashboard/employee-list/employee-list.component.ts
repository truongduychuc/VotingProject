import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {MdbTablePaginationComponent, MdbTableService} from "angular-bootstrap-md";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  page = 1;
  pageSize = 5;
  itemsPerPageArr = [5,10,15,20,25];
  listOfEmployees = [
    {username: 'gray' ,password: '12345678', first_name: 'Chuc', last_name: 'Truong', english_name: 'Gray', email: 'gray@enclave.vn', position: 'developer', team: 'Troy'},
    {username: 'roger' ,password: '12345678', first_name: 'Dinh', last_name: 'Le', english_name: 'Roger', email: 'roger@enclave.vn', position: 'developer', team: 'Troy'}
  ];
  constructor(private accountService: AccountService) { }
  ngOnInit() {

  }
  ngAfterViewInit(): void {
  }


}
