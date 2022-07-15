# JavaScript

### 해커뉴스 API 활용 프론트작업 링크
#### https://bin612.github.io/Js-Project/

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
3. type <br>
    => 전체적인 javascript의 code들을 typescript로 변환을 하였고
        내가 알고 있는 string, number와 같은 것들로 형변환?을 하는 것 같다.
        *지금 코드의 흐름은 형변환과 중복 제거 정도가 될 것 같다.*
4. class / interface <br>
    => 쉽게 말하면 객체를 사용하기 위해 class로 만들어서 사용하는 것이다.
        class를 선언하여 사용해준다면 재사용성이 강하다.
    => typescript에서 interface는 여러 가지 자료형의 타입을 정의하는 용도로 사용한다.
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

# Type 변경 후 / 2021.07.11
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

# Type 변경 / 2021.07.12

``` typescript
type News = {
    id:number;
    time_ago: string;
    title: string;
    url: string;
    user: string;
    content: string;
}

// 뉴스피드 형변환
// 인터섹션 type NewsFeed = News & {}
type NewsFeed = News & {
    comments_count: number;
    points: number;
    read?: boolean;
}

//뉴스상세 형변환
type NewsDetail = News & {
    comments: NewsComment[];
}

type NewsComment = News & {
    comments: NewsComment[];
    level: number;
}

```
