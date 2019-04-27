import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../../../_models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {AccountService} from "../../../_services/account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RoleService} from "../../../_services/role.service";
import {Role} from "../../../_models/role";
import {TeamService} from "../../../_services/team.service";
import {Team} from "../../../_models/team";

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './editing-modal.component.html',
  styleUrls: ['./editing-modal.component.scss']
})
export class EditingModalComponent implements OnInit {
  @Input()  title = 'Information';
  @Input()  public id: number;
  roles: Role[];
  teams: Team[];
  userProfile: User;
  directManager: any;
  message;
  editingUser: FormGroup;

  // params for update;
  constructor(public activeModal: NgbActiveModal, private accountService: AccountService, private fb: FormBuilder,
              private roleService: RoleService, private teamService: TeamService) { }

  ngOnInit() {
    this.getAllRoles();
    this.getAllTeams();
    this.getUserProfile(this.id);
  }
  generateForm() {
    this.editingUser = this.fb.group({
      id_role: this.userProfile.role.id,
      id_team: this.userProfile.team != null?this.userProfile.team.id:null,
      email: [this.userProfile.email,[Validators.email]],
      first_name: this.userProfile.first_name,
      last_name: this.userProfile.last_name,
      english_name: this.userProfile.english_name,
      other: this.userProfile.other,
      is_active: this.userProfile.is_active
    });
  }
  getUserProfile(id: number) {
    this.accountService.getUserProfileById(id).subscribe((userProfileRes:any) => {
      this.userProfile = userProfileRes.user;
      console.log(userProfileRes);
      this.generateForm();
      if(!userProfileRes.hasOwnProperty('directManager')) {
        this.message = userProfileRes.message;
        console.log(userProfileRes.message);
      }
      else {
        console.log('Has direct manager!');
        this.directManager = userProfileRes.directManager;
      }
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })
  }
  getAllRoles() {
    this.roleService.getAllRoles().subscribe((rolesRes:Role[]) => {
      this.roles = rolesRes;
      console.log(this.roles);
    }, error1 => {
      console.log(error1)
    });
  }
  getAllTeams() {
    this.teamService.getAllTeams().subscribe((teamsRes: Team[]) => {
      this.teams = teamsRes;
    }, error1 => {
      console.log(error1);
    })
  }
  updateUserProfile() {
    this.accountService.updateProfileForId(this.editingUser.value, this.id).subscribe(
      (res:any) => {
        this.activeModal.close('Success');
        alert(res.message);
      },
      error1 => {
        console.log(error1);
      }
    );
  }

}
