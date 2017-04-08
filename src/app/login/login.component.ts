import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginWindow: Window;
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    window.addEventListener('message', (e) => { this.parseConfig(e); }, false);
  }

  async parseConfig(event) {
    const { token, secret } = event.data;
    if (token && secret) {
      await this.loginService.setOauth({ token, secret });
      this.router.navigate(['twitter']);
      electron.ipcRenderer.send('end:express');
      this.loginWindow.close();
    }
  }

  login() {
    this.loginWindow = window.open('http://127.0.0.1:3000/auth/twitter', 'authWindow', 'height=600, width=480');
  }

}
