interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}

interface News {
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
interface NewsFeed extends News {
    readonly points: number;
    readonly comments_count: number;
    read?: boolean; // true/false인 boolean타입이라서 readonly 사용하면 안된다.
}

//뉴스상세 형변환
interface NewsDetail extends News {
    readonly comments: NewsComment[];
}

interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}

interface RouteInfo {
    path: string,
    page: View;
}

// const ajax: XMLHttpRequest = new XMLHttpRequest();
// const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store: Store = {
    currentPage : 1,
    feeds: [],
};

class Api {
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

class NewsFeedApi extends Api{
    getData(): NewsFeed[] {
    // 중복을 제거한 뒤 상위의 getRequest를 호출
     return this.getRequest<NewsFeed[]>();
    }
}

class NewsDetailApi extends Api {
    getData(): NewsDetail {
      return this.getRequest<NewsDetail>();
    }
  }

//공통된 요소를  View 클래스로 묶어줌
abstract class View {
    private template: string;
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];

    constructor(containerId: string, template: string){
        const containerElement = document.getElementById(containerId);

        if(!containerElement){
            throw "최상위 컨테이너가 없어 UI를 진행하지 못합니다.";
        }

        this.container = containerElement;
        this.template = template;
        this.renderTemplate = template;
        this.htmlList = [];
    }
    //return 값이 없을 땐 void
    protected updateView(): void {
        this.container.innerHTML = this.renderTemplate;
        this.renderTemplate = this.template;
    }

    protected addHtml(htmlString: string): void {
        this.htmlList.push(htmlString);
    }

    protected getHtml(): string {
        const snapshot = this.htmlList.join('');
        this.clearHtmlList();
        return snapshot;
    }

    protected setTemplateData(key: string, value: string): void {
        this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }

    private clearHtmlList(): void {
        this.htmlList = [];
    }
    abstract render(): void;

}

class Router {
    routeTable: RouteInfo[];
    defaultRoute: RouteInfo | null;

    constructor() {
        window.addEventListener('hashchange', this.route.bind(this));

        this.routeTable = [];
        this.defaultRoute = null;
    }

    setDefaultPage(page: View): void{
        this.defaultRoute = { path: '', page };
    }
    addRoutePath(path: string, page: View): void {
        this.routeTable.push({ path, page });
    }
    route(){
        const routePath = location.hash;

        if(routePath === '' && this.defaultRoute){
            this.defaultRoute.page.render();
        }

        for(const routeInfo of this.routeTable){
            if(routePath.indexOf(routeInfo.path) >= 0) {
                routeInfo.page.render();
                break;
            }
        }
    }
}


 class NewsFeedView extends View{
     private api: NewsFeedApi;
     private feeds: NewsFeed[];

     constructor(containerId: string) {
        let template: string = `
        <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
            <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
                <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
                </div>
                <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                    Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                    Next
                </a>
                </div>
            </div> 
            </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
            {{__news_feed__}}        
        </div>
        </div>
    `;

        super(containerId, template);
        // class를 만들어 줬으면 인스턴스를 꼭 만들어줘야 한다.
        this.api = new NewsFeedApi(NEWS_URL);
        this.feeds = store.feeds;

        if(this.feeds.length === 0){
            this.feeds = store.feeds = this.api.getData();
            this.makeFeeds();
        }
    }

     render(): void {
        store.currentPage = Number(location.hash.substr(7) || 1);

        for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
            //구조분해 할당 es5 이후에 추가된 문법
            const { id, title, comments_count, user, points, time_ago, read } =  this.feeds[i];
            this.addHtml(`
                <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                    <div class="flex">
                    <div class="flex-auto">
                        <a href="#/show/${id}">${title}</a>  
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
                    </div>
                    </div>
                    <div class="flex mt-3">
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-1"></i>${user}</div>
                        <div><i class="fas fa-heart mr-1"></i>${points}</div>
                        <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
                    </div>  
                    </div>
                </div>    
            `);
        } 
    
        //marking
        this.setTemplateData('news_feed', this.getHtml());
        this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
        this.setTemplateData('next_page', String(store.currentPage + 1));
    
        this.updateView();

     }

     //class의 멤버 안에 feeds 데이터가 있어서 return 필요 없음
     private makeFeeds(): void {
        for (let i = 0; i < this.feeds.length; i++) {
            this.feeds[i].read = false;
        }
    }
    
 }


class NewsDetailView extends View{
    constructor(containerId: string) {
        let template = `
            <div class="bg-gray-600 min-h-screen pb-8">
            <div class="bg-white text-xl">
                <div class="mx-auto px-4">
                <div class="flex justify-between items-center py-6">
                    <div class="flex justify-start">
                    <h1 class="font-extrabold">Hacker News</h1>
                    </div>
                    <div class="items-center justify-end">
                    <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                        <i class="fa fa-times"></i>
                    </a>
                    </div>
                </div>
                </div>
            </div>

            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>{{__title__}}</h2>
                <div class="text-gray-400 h-20">
                {{__content__}}
                </div>

                {{__comments__}}

            </div>
            </div>
        `;

        super(containerId,template);
    } 

    render() {
        const id = location.hash.substr(7); //주소 값을 7째 부터 시작
        const api = new NewsDetailApi(CONTENT_URL.replace('@id',id));
        const newsDetail: NewsDetail = api.getData();


        for(let i = 0; i < store.feeds.length; i++){
            if(store.feeds[i].id === Number(id)){
                store.feeds[i].read = true;
                break;
            }
        }
        this.setTemplateData('comments', this.makeComment(newsDetail.comments));
        this.setTemplateData('crrentPage', String(store.currentPage));
        this.setTemplateData('title', newsDetail.title);
        this.setTemplateData('content', newsDetail.content);

        this.updateView();
    }

       // web으로 부터 받아야 하는 인자임(데이터)으로 comments를 넣어야 한다.
        makeComment(comments: NewsComment[]): string {
            // test 
            for(let i = 0; i < comments.length; i++){
                const comment: NewsComment = comments[i];
                this.addHtml(`
                    <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
                    <div class="text-gray-400">
                        <i class="fa fa-sort-up mr-2"></i>
                        <strong>${comment.user}</strong> ${comment.time_ago}
                    </div>
                    <p class="text-gray-700">${comment.content}</p>
                    </div>      
                `);

                //함수가 자기 자신을 호출하는 것을 재귀호출
                //makeComments가 끝날 때 까지 호출
                if(comment.comments.length > 0){
                    this.addHtml(this.makeComment(comment.comments));
                }
            }
            return this.getHtml();
        }
}


//라우터 : 상황에 맞게 화면을 중계해주는 것 (a화면 b화면 c화면)


const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);

router.addRoutePath('/page/',newsFeedView);
router.addRoutePath('/show/',newsDetailView);

// reoter 실행
router.route();
