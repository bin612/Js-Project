const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';


function getData(url) {

    //동기적으로 처리하겠다 (false) 
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

let newsFead = getData(NEWS_URL);
const ul = document.createElement('ul'); 

window.addEventListener('hashchange', function(){
    const id = location.hash.substr(1);

    const newsContent = getData(CONTENT_URL.replace('@id',id));

    const title = document.createElement('h1');

    title.innerHTML = newsContent.title;

    content.appendChild(title);

});

for(let i = 0; i < 10; i++){
    
    const div = document.createElement('div');

    div.innerHTML = `
    <li>
        <a href="#${newsFead[i].id}">
        ${newsFead[i].title} (${newsFead[i].comments_count})
        </a>
    </li>    
    `;
   
    ul.appendChild(div);
} 

container.appendChild(ul);
container.appendChild(content);
