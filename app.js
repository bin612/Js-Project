const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
//동기적으로 처리하겠다 (false)
ajax.open('GET', 'NEWS_URL', false);
ajax.send();

//응답 값을 객체로 변환 (json일 경우)
let newsFead = JSON.parse(ajax.response);
const ul = document.createElement('ul'); 

for(let i = 0; i < 10; i++){
    const li = document.createElement('li');
    li.innerHTML = newsFead[i].title;
    ul.appendChild(li);
}

document.getElementById('root').appendChild(ul);