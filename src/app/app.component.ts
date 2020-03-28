import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  collapaseSideNav() {
    document.querySelector('#sidebar').classList.remove('active');
    document.querySelector('.overlay').classList.add('active');
  }

  Dimiss() {
    document.querySelector('#sidebar').classList.add('active');
    document.querySelector('.overlay').classList.remove('active');
  }
}
