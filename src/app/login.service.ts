import { Injectable } from '@angular/core';
import localforage from 'localforage/dist/localforage';

interface Oauth {
  token: String;
  secret: String;
}

@Injectable()
export class LoginService {
  oauth: Oauth;

  constructor() { }

  public async getOauth(): Promise<Oauth> {
    await localforage.ready();
    const oauth = await localforage.getItem('oauth');
    this.oauth = oauth;
    return oauth;
  }

  public async setOauth(oauth: Oauth): Promise<void> {
    await localforage.ready();
    await localforage.setItem('oauth', oauth);
    this.oauth = oauth;
  }

}
