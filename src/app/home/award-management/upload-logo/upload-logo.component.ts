import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageService} from '../../../_services/image.service';
@Component({
  selector: 'app-upload-logo',
  templateUrl: './upload-logo.component.html',
  styleUrls: ['./upload-logo.component.scss']
})
export class UploadLogoComponent implements OnInit {
  @Input() id: number;
  @Input() current_logo_url: string;
  description: string;
  uploadLogo: FormGroup;
  tempDisplaying: any;
  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private changeDetector: ChangeDetectorRef,
              private imageService: ImageService) { }

  ngOnInit() {
    this.displayLogoInitially();
    this.generateForm();
  }
  displayLogoInitially() {
    if (!this.current_logo_url) {
      this.description = 'This award has no logo!';
    } else {
      this.tempDisplaying = 'http://localhost:4000/' + this.current_logo_url;
    }
  }
  selectFile() {
    const inputGetFile = document.getElementById('gettingFileInput');
    inputGetFile.click();
  }
  onFileChange(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      this.description = 'New image';
      const file: File = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadLogo.controls['file'].setValue(file); // note
        this.tempDisplaying = reader.result;
        this.changeDetector.markForCheck();
      };
      if(this.uploadLogo.controls['file'].value) {
        this.description = 'New logo';
      }
    }

  }
  onSubmit() {
    if (this.uploadLogo.invalid) {
      console.log('Invalid form!');
      return;
    }
    this.imageService.uploadAwardLogo(this.uploadLogo.controls['file'].value, this.id)
      .subscribe( (resForUploadingAvt: any) => {
        this.activeModal.close('Updated logo successfully!');
      }, errUploading => {
        console.log(errUploading);
      });
  }
  generateForm() {
    this.uploadLogo = this.formBuilder.group({
      file: ['', Validators.required]
    });
  }

}
