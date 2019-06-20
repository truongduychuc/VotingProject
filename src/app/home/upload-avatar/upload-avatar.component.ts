import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageService} from '../../_services/image.service';
import {DataSharingService} from '../../_shared/data-sharing.service';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
  @Input() current_avt_url: string;
  description: string;
  uploadAvatar: FormGroup;
  tempDisplaying: any;
  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef,
              private imageService: ImageService, private shareData: DataSharingService) { }

  ngOnInit() {
    this.displayAvatarInitially();
    this.generateForm();
  }
  displayAvatarInitially() {
    if (!this.current_avt_url) {
      this.description = 'You have no avatar!';
    } else {
      this.tempDisplaying = 'http://localhost:4000/' + this.current_avt_url;
    }
  }
  selectFile() {
    const inputGetFile = document.getElementById('gettingFileInput');
    inputGetFile.click();
  }
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.description = 'New image';
      const file: File = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
       this.uploadAvatar.controls['file'].setValue(file); // note
        this.tempDisplaying = reader.result;
        this.changeDetector.markForCheck();
      };
      if(this.uploadAvatar.controls['file'].value) {
        this.description = 'New avatar';
      }
    }

  }
  onSubmit() {
    if (this.uploadAvatar.invalid) {
      console.log('Invalid form!');
      return;
    }
    this.imageService.uploadAvatar(this.uploadAvatar.controls['file'].value)
      .subscribe( () => {
        this.shareData.changeMessage('Avatar uploaded successfully!');
        this.activeModal.close('Avatar uploaded successfully!');
      }, errUploading => {
        console.log(errUploading);
      });
  }
  generateForm() {
    this.uploadAvatar = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }
}
