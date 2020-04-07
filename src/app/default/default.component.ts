import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit, OnDestroy {

  destroyed: false;

  constructor(private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    if (!this.destroyed) {
      setTimeout(() => {
        if (!this.destroyed) {
          const modalRef = this.modalService.open(LoginModalComponent, {
            backdrop: 'static',
            size: 'sm',
            backdropClass: 'login-modal-backdrop'
          });
          modalRef.result.then(close => {
            this.router.navigate(['home']);
          }, dismiss => {
            console.log(dismiss);
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed = false;
  }
}
