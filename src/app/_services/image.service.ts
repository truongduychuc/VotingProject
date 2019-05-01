import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  serverURL = 'http://localhost:4000/';
  constructor(private httpClient: HttpClient) {
  }
  uploadAvatar(image: File): Observable<any> {
    return this.httpClient.post(this.serverURL + 'users/upload_avatar', {avatar: image});
  }
}
