# Js-Project

1. Hacker News RestAPI 
2. javascript ajax 
3. DOM API
4. function / method 
5. paging
6. TypeScript porting

# TypeSctipt

1. SourceMap <br>
    => typingCode : typeScript <br>
    => computer : javaScript <br>
    작성 코드 typeScript 실제 computer가 해석하는 코드는 <br> javaScript로 하기 때문에 문제가 생기면 SourceMap을 통해 <br>
    전달 됨을 알 수 있다. 
2. dist <br>
    => typeScript 컴파일러가 typeScript file을 변환한 결과를 <br>
       dist 폴더에 출력해 놓은 것이라고 보면 된다.

# 변경 전
``` javascript
const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
    currentPage : 1,
    feeds: [],
};

```

# 변경 후
``` typescript
type Store = {
    currentPage: number;
    feeds: NewsFeed[];
}

type NewsFeed = {
    id : number;
    comment_count: number;
    url: string;
    user: string;
    time_ago: string;
    points: number;
    title: string;
    read?: boolean;
}

const container: HTMLElement | null = document.getElementById('root');
const ajax: XMLHttpRequest = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store: Store = {
    currentPage : 1,
    feeds: [],
};

```
