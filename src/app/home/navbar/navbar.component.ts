import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbDropdownConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AccountService} from '../../_services/account.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {ChangePasswordModalComponent} from '../change-password-modal/change-password-modal.component';
import {UploadAvatarComponent} from '../upload-avatar/upload-avatar.component';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit, OnDestroy {
  serverURL = environment.serverUrl;
  currentUserProfile: User;
  currentUserSubscription: Subscription;
  public sidebarOpened = false;

  constructor(private authService: AuthenticationService, private accountService: AccountService,
              private router: Router, config: NgbDropdownConfig, private modalService: NgbModal,
              private notifier: NotifierService) {
    config.placement = 'bottom';
  }

  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    } else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }

  ngOnInit() {
    this.getCurrentUserProfile();
  }

  getCurrentUserProfile() {
    this.currentUserSubscription = this.accountService.currentUser.subscribe(user => {
      this.currentUserProfile = user;
    });
  }

  renderName() {
    return this.currentUserProfile && this.currentUserProfile.first_name &&
    this.currentUserProfile.english_name && this.currentUserProfile.last_name &&
    this.isAdminName(this.currentUserProfile.first_name) ||
    this.isAdminName(this.currentUserProfile.english_name) ||
    this.isAdminName(this.currentUserProfile.last_name)
      ? 'Admin' :
      this.currentUserProfile.first_name + ' (' + this.currentUserProfile.english_name + ') ' + this.currentUserProfile.last_name;
  }

  private isAdminName = name => name.toUpperCase() === 'ADMIN';

  openChangingPasswordModal() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent);
    modalRef.result.then(successMessage => {
      this.notifier.notify('info', successMessage);
    });
  }

  openUploadingAvatarModal() {
    const modalRef = this.modalService.open(UploadAvatarComponent);
    modalRef.componentInstance.current_avt_url = this.currentUserProfile.ava_url;
    modalRef.result.then((success) => {
      this.notifier.notify('info', success);
      this.getCurrentUserProfile();
    }, reason => {
      console.log(reason);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['start-page']);
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

}
