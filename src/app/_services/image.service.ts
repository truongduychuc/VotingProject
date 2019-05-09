import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  serverURL = 'http://localhost:4000/';
  constructor(private httpClient: HttpClient) {
  }
  uploadAvatar(image: File) {
    const formData = new FormData();
    console.log(image.name);
    console.log(image);
    formData.append('avatar', image, image.name); // formData can not be logged by console.log
    return this.httpClient.post(this.serverURL + 'users/upload_avatar', formData);
  }
  uploadAwardLogo(image: File, id: number) {
    const formData = new FormData();
    console.log(image.name);
    console.log(image);
    formData.append('logo', image, image.name); // formData can not be logged by console.log
    return this.httpClient.post(this.serverURL + `awards/upload_logo/${id}`, formData);
  }
}
