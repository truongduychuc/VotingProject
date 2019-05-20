import {Component, Input, OnInit} from '@angular/core';
import {Nominee} from '../../../_models/nominee';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadLogoComponent} from '../upload-logo/upload-logo.component';
import {DataSharingService} from '../../../_shared/data-sharing.service';
import {User} from '../../../_models/user';
@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit {
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
  serverURL = 'http://localhost:4000/';
  // sharedData: for transferring successfully uploading logo message to award-management component
  constructor(private modalService: NgbModal, private sharedData: DataSharingService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.position.toUpperCase() === 'ADMIN';
  }
  get statusName() {
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
    const modalRef = this.modalService.open(UploadLogoComponent);
    modalRef.componentInstance.id = this.awardId;
    modalRef.componentInstance.current_logo_url = this.awardLogoURL;
    modalRef.result.then( () => {
      this.sharedData.changeMessage('Updated logo successfully!');
    }, dismiss => {
      // console.log(dismiss);
    });
  }

}
