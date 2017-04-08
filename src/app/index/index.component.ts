import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.checkLogin();
  }

  async checkLogin() {
    try {
      const { token, secret } = await this.loginService.getOauth();
      if (token && secret) {
        this.router.navigate(['twitter']);
      } else {
        this.handleError('Token not found');
      }
    } catch(e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    this.router.navigate(['login']);
    electron.ipcRenderer.send('start:express');
  }

}
