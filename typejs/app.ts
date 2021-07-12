
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
    readonly comments_count: number;
    readonly points: number;
    read?: boolean; // true/false인 boolean타입이라서 readonly 사용하면 안된다.
}

//뉴스상세 형변환
interface NewsDetail extends News {
    readonly comments: NewsComment[];
}

interface NewsComment extends News {
    readonly comments: NewsComment[];
    level: number;
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



//ajax url 처리 및 중복 제거 함수
//제네릭 <>
function getData<AjaxResponse>(url: string): AjaxResponse{

    ajax.open('GET', url, false);
    ajax.send();

    //JSON.parse(ajax.response) 값을 반환
    return JSON.parse(ajax.response);
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
    for (let i = 0; i < feeds.length; i++) {
        feeds[i].read = false;
    }
    return feeds;
}

//return 값이 없을 땐 void
function updateView(html: string): void {
    if(container){
        container.innerHTML = html;
    } else {
        console.error("최상위 컨테이너가 없어 UI를 진행하지 못했습니다.");
    }  
}

//뉴스 리스트 함수
function newsFeed(): void {

    let newsFeed: NewsFeed[] = store.feeds;
    const newsList = [];
    let template = `
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

    if(newsFeed.length === 0){
        newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));
    }

    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++){
        
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex">
                <div class="flex-auto">
                    <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                </div>
                <div class="text-center text-sm">
                    <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                </div>
                </div>
                <div class="flex mt-3">
                <div class="grid grid-cols-3 text-sm text-gray-500">
                    <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                    <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                    <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
                </div>  
                </div>
            </div>    
            `);
    } 

    //marking
    template = template.replace('{{__news_feed__}}', newsList.join(''));
    template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

    updateView(template);
}

//뉴스 상세 내용
function newsDetail(): void{
    const id = location.hash.substr(7); //주소 값을 7째 부터 시작
    const newsContent = getData<NewsDetail>(CONTENT_URL.replace('@id',id));

    let template = `
        <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
            <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
                <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
                </div>
                <div class="items-center justify-end">
                <a href="#/page/${store.currentPage}" class="text-gray-500">
                    <i class="fa fa-times"></i>
                </a>
                </div>
            </div>
            </div>
        </div>

        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
            <h2>${newsContent.title}</h2>
            <div class="text-gray-400 h-20">
            ${newsContent.content}
            </div>

            {{__comments__}}

        </div>
        </div>
    `;

    for(let i = 0; i < store.feeds.length; i++){
        if(store.feeds[i].id === Number(id)){
            store.feeds[i].read = true;
            break;
        }
    }

   updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}


   // web으로 부터 받아야 하는 인자임(데이터)으로 comments를 넣어야 한다.
   function makeComment(comments: NewsComment[]): string {
    const commentString = [];
    // test 
    for(let i = 0; i < comments.length; i++){
        const comment: NewsComment = comments[i];
        commentString.push(`
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
            commentString.push(makeComment(comment.comments));
        }
    }
    return commentString.join('');
}


//라우터 : 상황에 맞게 화면을 중계해주는 것 (a화면 b화면 c화면)
function router(): void{
    const routePath = location.hash;

    //location.hash에 #이 들어오면 빈값만 반환한다.
    if(routePath === ''){
        newsFeed();
    } else if(routePath.indexOf('#/page/') >= 0){
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    } else {
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();