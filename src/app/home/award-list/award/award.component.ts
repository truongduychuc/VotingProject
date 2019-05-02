import {Component, Input, OnInit} from '@angular/core';
import {Nominee} from '../../../_models/nominee';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UploadLogoComponent} from '../upload-logo/upload-logo.component';
import {DataSharingService} from '../../../_shared/data-sharing.service';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss']
})
export class AwardComponent implements OnInit {
  @Input() awardId: number;
  @Input() awardName: string;
  @Input() year: number;
  @Input() status: boolean;
  @Input() description: string;
  @Input() nominees: Nominee[];
  @Input() nominee: Nominee;
  @Input() dateStart: Date;
  @Input() dateEnd: Date;
  @Input() prize: string;
  @Input() item: string;
  @Input() awardLogoURL: string;

  serverURL = 'http://localhost:4000/';
  // sharedData: for transferring successfully uploading logo message to award-list component
  constructor(private modalService: NgbModal, private sharedData: DataSharingService) { }

  ngOnInit() {
  }
  openUploadingLogoModal() {
    const modalRef = this.modalService.open(UploadLogoComponent);
    modalRef.componentInstance.id = this.awardId;
    modalRef.componentInstance.current_logo_url = this.awardLogoURL;
    modalRef.result.then( success => {
    }, dismiss => {
      console.log(dismiss);
    });
  }

}
