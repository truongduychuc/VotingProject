import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Nominee} from '../../../_models/nominee';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadLogoComponent} from '../upload-logo/upload-logo.component';
import {DataSharingService} from '../../../_shared/data-sharing.service';
import {User} from '../../../_models/user';
import {NotifierService} from 'angular-notifier';
import {EditingAwardModalComponent} from '../editing-award-modal/editing-award-modal.component';
import {environment} from '../../../../environments/environment';
import {Subscription} from 'rxjs';
import {AccountService} from '../../../_services/account.service';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit, OnDestroy {
  @Input() awardId: number;
  @Input() awardName: string;
  @Input() year: number;
  @Input() status: number;
  @Input() description: string;
  @Input() nominees: Nominee[];
  @Input() nominee: Nominee;
  @Input() dateStart: Date;
  @Input() dateEnd: Date;
  @Input() prize: string;
  @Input() item: string;
  @Input() awardLogoURL: string;

  currentUser: User;
  pageLoadState = {
    currentUser: false
  };
  subscription: Subscription;
  serverURL = environment.serverUrl;

  // sharedData: for transferring successfully uploading logo message to award-management component
  constructor(
    private modalService: NgbModal,
    private sharedData: DataSharingService,
    private notifier: NotifierService,
    private accountService: AccountService) {

  }

  ngOnInit() {
    this.subscribeCurrentUser();
  }

  private subscribeCurrentUser(): void {
    this.subscription = this.accountService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.pageLoadState.currentUser = true;
    });
  }

  get isAdmin(): boolean {
    return this.pageLoadState.currentUser && this.currentUser.role.name.toLowerCase() === 'admin';
  }

  get statusName(): string {
    if (this.status === 0) {
      return 'Finished';
    }
    if (this.status === 1) {
      return 'Pending';
    }
    if (this.status === 2) {
      return 'Voting';
    }
  }

  get statusCssClass() {
    if (this.status === 0) {
      return 'badge-info';
    }
    if (this.status === 1) {
      return 'badge-warning';
    }
    if (this.status === 2) {
      return 'badge-success';
    }
  }

  openUploadingLogoModal() {
    if (!this.isAdmin) {
      return;
    }
    const modalRef = this.modalService.open(UploadLogoComponent);
    modalRef.componentInstance.id = this.awardId;
    modalRef.componentInstance.current_logo_url = this.awardLogoURL;
    modalRef.result.then(successMes => {
      this.sharedData.changeMessage('Updated logo successfully!');
      this.notifier.notify('info', successMes);
    }, dismiss => {
      // console.log(dismiss);
    });
  }

  openEditingAwardModal(awardId: number) {
    const modalRef = this.modalService.open(EditingAwardModalComponent);
    modalRef.componentInstance.awardId = awardId;
    modalRef.result.then(successMes => {
      this.sharedData.changeMessage('Updated award successfully!');
      this.notifier.notify('info', successMes);
    }, dismiss => {
      // console.log(dismiss);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
