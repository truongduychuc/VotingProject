import {Component} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Voting Project';

  constructor(private socket: Socket) {
    this.socket.on('news', data => {
      console.log(data);
    });
  }

}
