import View from '../core/view';

export interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

export interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}


// 뉴스피드 형변환
// 인터섹션 type NewsFeed = News & {}
// readonly 지시어라고 말한다. Typescript에서 지원하는 기능 중 하나
export interface NewsFeed extends News {
    readonly points: number;
    readonly comments_count: number;
    read?: boolean; // true/false인 boolean타입이라서 readonly 사용하면 안된다.
}

//뉴스상세 형변환
export interface NewsDetail extends News {
    readonly comments: NewsComment[];
}

export interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

export interface RouteInfo {
    path: string,
    page: View;
}


export const store: Store = {
    currentPage : 1,
    feeds: [],
};

