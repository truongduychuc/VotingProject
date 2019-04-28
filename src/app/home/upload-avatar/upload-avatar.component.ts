import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
  @Input() id: number;
  @Input() current_avt_url: string;
  description: string = 'Current avatar:';
  uploadAvatar: FormGroup;
  tempDisplaying:any = 'http://localhost:4000/' + this.current_avt_url;
  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.generateForm();
  }
  selectFile() {
    const inputGetFile = document.getElementById('gettingFileInput');
    inputGetFile.click();
  }
  onFileChange(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.uploadAvatar.patchValue({
          file: reader.result
        });
        this.tempDisplaying = reader.result;
        this.changeDetector.markForCheck();
      };
    }
  }
  generateForm() {
    this.uploadAvatar = this.formBuilder.group({
      file: [null, Validators.required]
    });
  }
}
