import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {AccountService} from "../../_services/account.service";
import {User} from "../../_models/user";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public samplePagesCollapsed = true;
  constructor() {
  }

  ngOnInit() {
  }

}
