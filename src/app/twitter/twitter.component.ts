import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login.service';
import { TweetsService } from './tweets.service';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  account: any;
  tweets: any;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private tweetsService: TweetsService
  ) {
    this.tweetsService.accountInfo.subscribe((account) => {
      this.account = account;
    });
    this.tweetsService.tweetsEvent.subscribe((tweets) => {
      console.log(tweets);
      this.tweets = tweets;
    });
  }


  ngOnInit() {
    this.tweetsService.getCredentials();
    this.tweetsService.getTweets();
  }

  async logout() {
    await this.loginService.logout();
    electron.ipcRenderer.send('logout');
    this.router.navigate(['login']);
  }

}
