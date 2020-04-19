import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})


export class ConfirmModalComponent {
  @Input()
  title: string;
  @Input()
  content: string;
  @Input()
  type = 'danger'; // default type

  constructor(private activeModal: NgbActiveModal) {
  }

  get themeColor() {
    if (this.type === 'danger') {
      return 'modal-confirm-danger';
    }
    if (this.type === 'primary') {
      return 'modal-confirm-info';
    }
  }

  get buttonColor() {
    return this.type;
  }

  closeModal(): void {
    this.activeModal.close('Yes!');
  }

  dismissModal(): void {
    this.activeModal.dismiss('No!');
  }

}
