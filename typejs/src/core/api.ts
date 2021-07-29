import { NewsFeed, NewsDetail } from '../types'

export default class Api {
    ajax: XMLHttpRequest;
    url: string;

    constructor(url: string) {
        this.url = url;
        this.ajax = new XMLHttpRequest();
    }

    //중복 요소
    getRequest<AjaxResponse>(): AjaxResponse {
        this.ajax.open('GET', this.url, false);
        this.ajax.send();

        return JSON.parse(this.ajax.response);
        }
    }

export class NewsFeedApi extends Api{
    getData(): NewsFeed[] {
    // 중복을 제거한 뒤 상위의 getRequest를 호출
     return this.getRequest<NewsFeed[]>();
    }
}

export class NewsDetailApi extends Api {
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
    }
  }