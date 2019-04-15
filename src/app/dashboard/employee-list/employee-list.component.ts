import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {User} from "../../_models/user";
import {HttpErrorResponse, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  currentPage = 1;
  currentPageSize = 10;
  currentSearchText: string;
  currentSortedColumn: string;
  currentSortedType = 'ASC';
  currentSortedTable: string;
  totalRecords: number;   // total number of Users
  currentRecords: number; // amount of records filtered
  itemsPerPageArr = [2,5,10,15,20,25];

  usersList : User[];
  constructor(private accountService: AccountService) { }
  ngOnInit() {
    this.reloadPreviousStatus();
  }
  deleteUser(id: number) {
    console.log(id);
    this.accountService.deleteUser(id).subscribe(
      (res:any) => {
        alert(res.message);
        this.getUserListPerPage(this.currentSortedColumn, this.currentSortedType, this.currentSortedTable,
          this.currentSearchText, this.currentPageSize, this.currentPage);
      },
      (error1:any) => {
        console.log(error1);
      }
    );
  }
  reloadPreviousStatus() {
    // get params at the last times getting user list
    let previousParams = this.getPreviousStatus();
    console.log(previousParams.get('updates'));
    let reloadedParams = new HttpParams();
    reloadedParams = reloadedParams
      .append('col', previousParams.get('col')
      ).append('type',previousParams.get('type')
      ).append('table', previousParams.get('table')
      ).append('search', previousParams.get('search')
      ).append('count', previousParams.get('count')
      ).append('page', previousParams.get('page'));
    this.getUserListAtParams(reloadedParams);
  }
  getUserListAtParams(params: HttpParams) {
    // if params has no param, this function will get default list
    this.accountService.getUsersList(params).subscribe(
      (res) => {
        this.usersList = res.result;
        this.totalRecords = res.total_counts;
        if(!res.filtered_counts) {
          this.currentRecords = this.totalRecords;
        }
        else {
          this.currentRecords = res.filtered_counts;
        }
        console.log(this.totalRecords);
        this.saveCurrentStatus(params);
        console.log(res);
      },(err:HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
   getUserListPerPage(sortColumn?:string, sortType?:string, sortTable?:string, searchText?:string, itemsPerPage?:number, currentPage?:number) {
    let params = new HttpParams();
    if (sortColumn != null) {
      params = params.append('col', sortColumn); // using append need params = params*before*.append...
      console.log(sortColumn);
    }
    if (sortType != null) {
      params = params.append('type', sortType);
      console.log(sortType);
    }
    if (sortTable != null) {
      params = params.append('table', sortTable);
      console.log(sortTable);
    }
    if (searchText != null) {
      params = params.append('search', searchText);
      console.log(searchText);
    }
    if (itemsPerPage != null) {
      params = params.append('count', itemsPerPage.toString());
      console.log(itemsPerPage);
    }
    if (currentPage != null) {
      params = params.append('page', currentPage.toString());
      console.log(currentPage);
    }
    this.accountService.getUsersList(params).subscribe(
      (res) => {
        this.usersList = res.result;
        this.totalRecords = res.total_counts;
        if(!res.filtered_counts) {
          this.currentRecords = this.totalRecords;
        }
        else {
          this.currentRecords = res.filtered_counts;
        }
        console.log(this.totalRecords);
        this.saveCurrentStatus(params);
        console.log(res);
      },(err:HttpErrorResponse) => {
        console.log(err);
      }
    );
  }
  private searchOnText() {
    this.getUserListPerPage(this.currentSortedColumn, this.currentSortedType,this.currentSortedTable, this.currentSearchText,
      this.currentPageSize,this.currentPage);
  }

  // called when changing to new page
  pageChange(newPage: number) {
    // this function is called before the current page is changed to new page, so here need to take user list of newPage
    // console.log(this.currentPage);
    console.log(newPage);
    this.getUserListPerPage(this.currentSortedColumn, this.currentSortedType,this.currentSortedTable, this.currentSearchText,
      this.currentPageSize,newPage);

  }
  changeSortOnColumn() {

  }

  // called when select box's value changed
  onChangeItemsPerPage() {
    this.getUserListPerPage(this.currentSortedColumn, this.currentSortedType,this.currentSortedTable, this.currentSearchText,
      this.currentPageSize,this.currentPage);
  }

  // stay on current status after reloading page
  saveCurrentStatus(/*sortColumn:string, sortType:string, sortTable:string, searchText:string, itemsPerPage:number, currentPage:number*/ params: HttpParams) {
    // session Storage actually get cleared as the browser is closed.
   /* sessionStorage.setItem('currentSortedColumn', sortColumn);
    sessionStorage.setItem('currentSortedType', sortType);
    sessionStorage.setItem('currentSortedTable', sortTable);
    sessionStorage.setItem('currentSearchText', searchText);
    sessionStorage.setItem('currentPage', currentPage.toString());
    sessionStorage.setItem('currentPageSize', this.currentPageSize.toString());*/
   sessionStorage.setItem('lastParams', JSON.stringify(params));
  }
  // try to get previous page status
  getPreviousStatus(): HttpParams {
    /*let currentSortedColumn = sessionStorage.getItem('currentSortedColumn');
    if(currentSortedColumn!= undefined && currentSortedColumn !== 'undefined'){
      this.currentSortedColumn = currentSortedColumn;
    }
    let currentSortedType = sessionStorage.getItem('currentSortedType');
    if(currentSortedType != undefined && currentSortedType !== 'undefined') {
      this.currentSortedType = currentSortedType;
    }
    let currentSortedTable = sessionStorage.getItem('currentSortedTable');
    if(currentSortedTable != undefined && currentSortedTable !== 'undefined') {
      this.currentSortedTable = currentSortedTable;
    }
    let currentSearchText = sessionStorage.getItem('currentSearchText');
    if(currentSearchText != undefined && currentSearchText !== 'undefined') {
      this.currentSearchText = currentSearchText;
    }
    let currentPage = sessionStorage.getItem('currentPage');
    if(currentPage != undefined && currentPage !== 'undefined') {
      this.currentPage = parseInt(currentPage);
    }
    let currentPageSize = sessionStorage.getItem('currentPageSize');
    if(currentPageSize != undefined && currentPageSize !== 'undefined') {
      this.currentPageSize = parseInt(currentPageSize);
    }*/
    let params: HttpParams = JSON.parse(sessionStorage.getItem('lastParams'));
    return params;
  }
  // remove status as route to other component in routeLinks set
   removeStatus() {
   /* sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('currentPageSize');
    sessionStorage.removeItem('currentSearchText');
    sessionStorage.removeItem('currentSortedType');
    sessionStorage.removeItem('currentSortedColumn');
    sessionStorage.removeItem('currentSortedTable');*/
   sessionStorage.removeItem('lastParams');
  }
 ngOnDestroy(): void {
    this.removeStatus();
    console.log('Destroyed!');
 }
}
