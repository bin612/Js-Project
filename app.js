const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

//ajax url 처리 및 중복 제거 함수
function getData(url) {

    ajax.open('GET', url, false);
    ajax.send();

    //JSON.parse(ajax.response) 값을 반환
    return JSON.parse(ajax.response);
}

//뉴스 리스트 함수
function newsFeed() {
    const newsFeed = getData(NEWS_URL);
    //배열
    const newsList = [];

    newsList.push('<ul>');

    for(let i = 0; i < 10; i++){
        
        newsList.push( `
        <li>
            <a href="#${newsFeed[i].id}">
            ${newsFeed[i].title} (${newsFeed[i].comments_count})
            </a>
        </li>    
        `);   
    } 
    newsList.push('</ul>');

    container.innerHTML = newsList.join('');

}

//뉴스 상세 내용
function newsDetail(){
    const id = location.hash.substr(1);
    const newsContent = getData(CONTENT_URL.replace('@id',id));

    container.innerHTML = `
    <h1>${newsContent.title}</h1>

    <div>
        <a href="#">목록으로</a>
    </div>    
    `;
}

//라우터 : 상황에 맞게 화면을 중계해주는 것 (a화면 b화면 c화면)
function router(){
    const routPath = location.hash;

    //location.hash에 #이 들어오면 빈값만 반환한다.
    if(routPath === ''){
        newsFeed();
    }
    else{
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();