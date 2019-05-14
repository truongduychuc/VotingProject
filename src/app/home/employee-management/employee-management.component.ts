import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../_services/account.service';
import {User} from '../../_models/user';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditingModalComponent} from './editing-modal/editing-modal.component';
import {CreatingUserModalComponent} from './creating-user-modal/creating-user-modal.component';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']

})
export class EmployeeManagementComponent implements OnInit, OnDestroy {
  currentPage = 1;
  currentPageSize = 10;
  currentSearchText: string;
  currentSortedColumn: string = 'first_name';
  currentSortedType = 'ASC';
  currentSortedTable: string = 'user';
  totalRecords: number;   // total number of Users
  currentRecords: number; // amount of records filtered
  itemsPerPageArr = [2, 5, 10, 15, 20, 25];
  error: any;
  usersList: User[];

  // for determining whether the current user is admin
  currentUser: User;
  previousSearchText: string;
  constructor(private accountService: AccountService, private authService: AuthenticationService, private modalService: NgbModal) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
  ngOnInit() {
    this.reloadPreviousStatus();
  }
  deleteUser(id: number) {
    console.log(id);
    this.accountService.deleteUser(id).subscribe(
      (res: any) => {
        alert(res.message);
        this.getUserListPerPage(); // reload table
      },
      (deletingError: any) => {
        console.log(deletingError);
      }
    );
  }

  resetPassword(id: number) {
    this.accountService.resetPassword(id).subscribe(
      (res: any) => {
        alert(res.message);
        this.getUserListPerPage();
      }, err => {
        console.log(err);
      }
    );
  }
  // after pressing F5 or click reloading page button, user is still in the last page's status
  reloadPreviousStatus() {
    // get params at the last times getting user list
    let lastEmployeeParams = this.getPreviousStatus();  // if your last res is 'there is no result', it will be {}
    if(null == lastEmployeeParams) {   // when you open browser initially
      // load default list
     this.getUserListPerPage();
    } else {
      let reloadedParams = new HttpParams();
      // get last query params and append to reloadedParams

      let lastCol = lastEmployeeParams.col;
      if (lastCol) {  // if lastCol is undefined, if(lastCol) will return false
        reloadedParams = reloadedParams.append('col', lastCol);  // it will be undefined if lastEmployeeParams is {}
        this.currentSortedColumn = lastCol; // recover component to last status, such as previous select box's value
      }
      let lastType = lastEmployeeParams.type;
      if (lastType) {
        reloadedParams = reloadedParams.append('type', lastEmployeeParams.type);
        this.currentSortedType = lastType;
      }
      let lastTable = lastEmployeeParams.table;
      if (lastTable) {
        reloadedParams = reloadedParams.append('table', lastEmployeeParams.table);
        this.currentSortedTable = lastTable;
      }
      let lastSearch = lastEmployeeParams.search;
      if (lastSearch) {
        reloadedParams = reloadedParams.append('search', lastEmployeeParams.search);
        this.currentSearchText = lastSearch;
      }
      let lastCount = lastEmployeeParams.count;
      if (lastCount) {
        reloadedParams = reloadedParams.append('count', lastEmployeeParams.count);
        this.currentPageSize = lastCount;
      }
      let lastPage = lastEmployeeParams.page;
      if(lastPage) {
        reloadedParams = reloadedParams.append('page', lastEmployeeParams.page);
        this.currentPage = lastPage;
      }
      this.accountService.getUsersList(reloadedParams).subscribe(
        (res) => {
          this.usersList = res.data;
          this.totalRecords = res.total_counts;
          if (!res.filtered_counts) {
            this.currentRecords = this.totalRecords;
          } else {
            this.currentRecords = res.filtered_counts;
          }
          this.saveCurrentStatus(lastEmployeeParams);
          console.log(res);
        }, (err: HttpErrorResponse) => {
          console.log(err);
          this.error = err;
        }
      );
    }

  }
  getUserListPerPage(sortColumn?: string, sortType?: string, sortTable?: string, searchText?: string, itemsPerPage?: number, currentPage?: number) {
    let params = new HttpParams();
    if (null == sortColumn && this.currentSortedColumn) {
      // if sortColumn param wasn't passed, the function will call current status of page
      sortColumn = this.currentSortedColumn;
      params = params.append('col', sortColumn);
    } else {
      if (sortColumn) {
        params = params.append('col', sortColumn); // using append need params = params*before*.append...
        console.log(sortColumn);
      }
    }
    if(null == sortType && this.currentSortedType) {
      sortType = this.currentSortedType;
      params = params.append('type', sortType);
    } else {
      if (sortType) {
        params = params.append('type', sortType);
        console.log(sortType);
      }
    }
    if (null == sortTable && this.currentSortedTable) {
      sortTable = this.currentSortedTable;
      params = params.append('table', sortTable);
    } else {
      if (sortTable) {
        params = params.append('table', sortTable);
        console.log(sortTable);
      }
    }
    if (null == searchText && this.currentSearchText) {
      searchText = this.currentSearchText;
      params = params.append('search', searchText);
    } else {
      if (searchText) {
        params = params.append('search', searchText);
        console.log(searchText);
      }
    }
    if (null == itemsPerPage && this.currentPageSize) {
      itemsPerPage = this.currentPageSize;
      params = params.append('count', itemsPerPage.toString());
    } else {
      if (itemsPerPage) {
        params = params.append('count', itemsPerPage.toString());
        console.log(itemsPerPage);
      }
    }
    if (null == currentPage && this.currentPage) {
      currentPage = this.currentPage;
      params = params.append('page', currentPage.toString());
    } else {
      if (currentPage) {
        console.log(currentPage);
        params = params.append('page', currentPage.toString());
      }
    }
    this.accountService.getUsersList(params).subscribe(
      (res) => {
        this.usersList = res.data;
        this.totalRecords = res.total_counts;
        if (!res.filtered_counts) {
          this.currentRecords = this.totalRecords;
        } else {
          this.currentRecords = res.filtered_counts;
        }
        // console.log(this.totalRecords);
        let lastEmployeeParams = {
          col: sortColumn,
          type: sortType,
          table: sortTable,
          search: searchText,
          count: itemsPerPage,
          page: currentPage
        };
        this.saveCurrentStatus(lastEmployeeParams);
        console.log(res);
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.error = err;
      }
    );
  }
  // for search input
  searchOnText() {
    if (this.currentSearchText === this.previousSearchText) {
      return;
    }
    this.error = undefined;
    this.getUserListPerPage();
    this.previousSearchText = this.currentSearchText;
  }

  // change sort direction
  changeSortType() {
    if (this.currentSortedType === 'ASC') {
      this.currentSortedType = 'DESC';
    } else {
      this.currentSortedType = 'ASC';
    }
  }

  // sort on Column Name, if column belongs to tableName
  sortOnColumn(columnName: string, tableName: string) {
    if (this.currentSortedColumn === columnName && this.currentSortedTable === tableName) {
      // check if you sort at same column => change sort direction
      this.changeSortType();
    } else {
      this.currentSortedType = 'ASC';
      this.currentSortedColumn = columnName;
      this.currentSortedTable = tableName;
    }
    this.getUserListPerPage();
  }
  // called when changing to new page number in pagination
  pageChange(newPage: number) {
    // this function is called before the current page is changed to new page, so here need to take user list of newPage
    // console.log(this.currentPage);
    console.log(newPage);
    this.getUserListPerPage(this.currentSortedColumn, this.currentSortedType, this.currentSortedTable, this.currentSearchText,
      this.currentPageSize, newPage);

  }


  // called when select box's value changed
  onChangeItemsPerPage() {
    this.getUserListPerPage();
  }

  // stay on current status after reloading page
  saveCurrentStatus(lastEmployeeParams: Object) {
    // session Storage actually get cleared as the browser is closed.
  sessionStorage.setItem('lastEmployeeParams', JSON.stringify(lastEmployeeParams));
  }

  // try to get previous page status
  getPreviousStatus() {
   let lastEmployeeParams = JSON.parse(sessionStorage.getItem('lastEmployeeParams'));
   console.log(lastEmployeeParams);
   return lastEmployeeParams;
  }

  // remove status as route to other component in routeLinks set
   removeStatus() {
   sessionStorage.removeItem('lastEmployeeParams');
  }
  openEditingModal(id: number) {
    const modalRef = this.modalService.open(EditingModalComponent, {centered: true});
    modalRef.componentInstance.id = id;
    modalRef.result.then(value => {
      this.getUserListPerPage();
    }, reason => {
      console.log(reason);
    });
  }
  openCreatingModal() {
    const modalRef = this.modalService.open(CreatingUserModalComponent, {centered: true, backdrop: 'static'});
    modalRef.result.then(value => {  // had created successfully
      this.getUserListPerPage();
    }, reason => {
      console.log(reason);
    });
  }

 ngOnDestroy(): void {
    this.removeStatus();
    console.log('Destroyed!');
 }
}
