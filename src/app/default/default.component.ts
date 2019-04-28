import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LoginModalComponent} from "./login-modal/login-modal.component";

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.modalService.open(LoginModalComponent, {centered: true, backdrop: "static"});
    });
  }


}
