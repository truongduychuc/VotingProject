import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LoginFormComponent} from "./login-form/login-form.component";

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
      this.modalService.open(LoginFormComponent, {centered: true, backdrop: "static"});
    });
  }


}
