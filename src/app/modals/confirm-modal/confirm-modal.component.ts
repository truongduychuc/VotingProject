import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  content: string;
  @Input()
  type: string = 'danger'; // default type
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  get themeColor() {
    if (this.type === 'danger') {
      return 'modal-confirm-danger';
    }
    if (this.type === 'primary') {
      return  'modal-confirm-info';
    }
  }
  get buttonColor() {
    return this.type;
  }
}
