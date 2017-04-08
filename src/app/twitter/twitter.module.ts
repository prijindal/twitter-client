import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwitterRoutingModule } from './twitter-routing.module';
import { TwitterComponent } from './twitter.component';
import { TweetsService } from './tweets.service';

@NgModule({
  imports: [
    CommonModule,
    TwitterRoutingModule
  ],
  declarations: [TwitterComponent],
  providers: [TweetsService]
})
export class TwitterModule { }
