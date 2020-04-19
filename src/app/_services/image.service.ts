import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiService, IAPIResponse} from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  serverURL = environment.serverUrl;

  constructor(private apiService: ApiService) {
  }

  uploadAvatar(image: File): Observable<IAPIResponse> {
    const formData = new FormData();
    formData.append('avatar', image, image.name); // formData can not be logged by console.log
    return this.apiService.post('users/upload_avatar', formData);
  }

  uploadAwardLogo(image: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('logo', image, image.name);
    return this.apiService.post(`awards/upload_logo/${id}`, formData);
  }
}
