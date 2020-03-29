import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newTaskBtn: boolean;

  constructor(private router: Router) {}

  collapaseSideNav() {
    document.querySelector('#sidebar').classList.remove('close');
    document.querySelector('#sidebar').classList.add('open');
    document.querySelector('.overlay').classList.add('active');
  }

  Dimiss() {
    document.querySelector('#sidebar').classList.remove('open');
    document.querySelector('#sidebar').classList.add('close');
    document.querySelector('.overlay').classList.remove('active');
  }

  navigate(url) {
    this.router.navigateByUrl(url);
    this.Dimiss();
  }
}
