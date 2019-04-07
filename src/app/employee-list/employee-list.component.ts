import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../_services/account.service";
import {MdbTablePaginationComponent, MdbTableService} from "angular-bootstrap-md";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  CURRENT_SORT_ICON = 'sort';
  searchKeyWord : string = '';
  previous: string;
  itemsPerPage = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  listOfEmployees = [
    {username: 'gray' ,password: '12345678', first_name: 'Chuc', last_name: 'Truong', english_name: 'Gray', email: 'gray@enclave.vn', position: 'developer', team: 'Troy'},
    {username: 'roger' ,password: '12345678', first_name: 'Dinh', last_name: 'Le', english_name: 'Roger', email: 'roger@enclave.vn', position: 'developer', team: 'Troy'}
  ];

  firstItemIndex;
  lastItemIndex;
  constructor(private accountService: AccountService, private mdbTableService: MdbTableService, private cdRef:ChangeDetectorRef) { }
  @HostListener('input') oninput() {
    this.searchRecords();
  }
  ngOnInit() {
    this.mdbTableService.setDataSource(this.listOfEmployees);
    this.listOfEmployees = this.mdbTableService.getDataSource();
    this.previous = this.mdbTableService.getDataSource();
  }
  ngAfterViewInit(): void {
  }

  onChangeDirection() {
    if(this.CURRENT_SORT_ICON === 'sort') {
      this.CURRENT_SORT_ICON = 'sort-up';
    }
    if(this.CURRENT_SORT_ICON === 'sort-up') {
      this.CURRENT_SORT_ICON = 'sort-down';
    }
    if(this.CURRENT_SORT_ICON === 'sort-down') {
      this.CURRENT_SORT_ICON = 'sort-up';
    }
  }
  searchRecords() {
    const prev = this.mdbTableService.getDataSource();
    if(!this.searchKeyWord) {
      this.mdbTableService.setDataSource(this.previous);
      this.listOfEmployees = this.mdbTableService.getDataSource();
    }

    if(this.searchKeyWord) {
      this.listOfEmployees = this.mdbTableService.searchLocalDataBy(this.searchKeyWord);
      this.mdbTableService.setDataSource(prev);
    }
  }

}
