import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwitterRoutingModule } from './twitter-routing.module';
import { TwitterComponent } from './twitter.component';
import { TweetsService } from './tweets.service';
import { TweetComponent } from './../tweet/tweet.component';

@NgModule({
  imports: [
    CommonModule,
    TwitterRoutingModule
  ],
  declarations: [TwitterComponent, TweetComponent],
  providers: [TweetsService]
})
export class TwitterModule { }
