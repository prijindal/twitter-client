import { TwitterClientPage } from './app.po';

describe('twitter-client App', () => {
  let page: TwitterClientPage;

  beforeEach(() => {
    page = new TwitterClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
