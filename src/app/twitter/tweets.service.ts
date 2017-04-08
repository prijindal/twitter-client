import { Injectable, EventEmitter } from '@angular/core';
import localforage from 'localforage/dist/localforage';

const config = {
  consumerKey: '9NjY4wu59Mz7PlAOUej6PFBlb',
  consumerSecret: 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99',
}

const TWITTER_MODULE = '/home/prijindal/projects/twitter-client/node_modules/twitter';

import { LoginService } from '../login.service';

@Injectable()
export class TweetsService {
  client: any;
  public accountInfo: EventEmitter<any> = new EventEmitter<any>();
  public tweetsEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private loginService: LoginService
  ) {
    this.initClient();
  }

  async repopulate() {
    const account = await localforage.getItem('account');
    this.accountInfo.emit(account);
    const tweets = await localforage.getItem('tweets');
    this.tweetsEvent.emit(tweets);
  }

  async initClient() {
    if (this.client) {return this.client;};
    const oauth = await this.loginService.getOauth();
    const Twitter = window['require'](TWITTER_MODULE);
    this.client = new Twitter({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        access_token_key: oauth.token,
        access_token_secret: oauth.secret
    });
    return this.client;
  }

  get(url, params = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.initClient()
      .then(() => {
        params = {
          screen_name: 'nodejs',
          ...params,
        };
        this.client.get(url, params, (err, body, response) => {
          if (!err) {
            resolve(body);
          } else {
            console.error(err);
            reject(err);
          }
        });
      });
    });
  }

  async getCredentials() {
    const account = await this.get('account/verify_credentials');
    this.accountInfo.emit(account);
    localforage.setItem('account', account);
  }

  async getTweets() {
    const tweets = await this.get('statuses/home_timeline');
    this.tweetsEvent.emit(tweets);
    localforage.setItem('tweets', tweets);
  }
}
