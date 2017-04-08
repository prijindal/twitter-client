import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})
export class TweetComponent implements OnInit {
  @Input()
  tweet: any;
  constructor() { }

  ngOnInit() {
  }

  renderTime() {
    return moment(new Date(this.tweet.created_at)).fromNow();
  }

  renderText() {
    const { entities } = this.tweet;
    let { text } = this.tweet;
    const { hashtags, symbols, urls, user_mentions } = entities;
    const mentionsReplacement = user_mentions.map(data => this.mentionParser(data, text));
    const urlsReplacement = urls.map(data => this.mentionParser(data, text));

    mentionsReplacement.forEach((data) => {
      text = this.mentionTextReplacer(data, text, `https://twitter.com/${data.mention.screen_name}`)
    });
    urlsReplacement.forEach((data) => {
      text = this.mentionTextReplacer(data, text, data.mention.expanded_url)
    });
    return text;
  }

  private mentionParser(mention, text) {
    let mentionString = text.substring(mention.indices[0], mention.indices[1])
    return { mentionString, mention };
  }

  private mentionTextReplacer({mentionString, mention}, text, url) {
    return text.replace(mentionString,
      `<a href="${url}">${mentionString}
        </a>`
      )
  }

}
