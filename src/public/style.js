const header = document.getElementsByTagName('header');
const anchor = document.getElementsByTagName('a');
const h1 = document.getElementsByTagName('h1');
const h2 = document.getElementsByTagName('h2');
const h3 = document.getElementsByTagName('h3');
const p = document.getElementsByTagName('p');
const body = document.getElementsByTagName('body');
const background = document.getElementById('background');
const title = document.getElementById('partytitle');
const subtitle = document.getElementById('subtitle');
const login = document.getElementById('login');

let ultimaPosicaoScroll = window.scrollY;

const checkBox = document.getElementById('changeTheme');

    window.addEventListener('scroll', ()=>{
        const posicaoAtualScroll = window.scrollY;

        const valorMinimoScroll = 300;

        if (posicaoAtualScroll > valorMinimoScroll){
            console.log('Deslizou para baixo');
            background.style.height = '100px';
            background.style.top = '50px';
            background.style.position = 'fixed';
            title.style.fontSize = '65px';
            subtitle.style.fontSize = '15px';
            body.style.height = '200vh';
            login.style.position = 'fixed';
        } else if (posicaoAtualScroll < ultimaPosicaoScroll){
            console.log('Deslizou para cima');
            background.style.position = 'absolute'
            background.style.height = '100vh';
            background.style.top = '50px';
            title.style.fontSize = '275px';
            subtitle.style.fontSize = '100px';
            login.style.position = 'absolute';

        }

        ultimaPosicaoScroll = posicaoAtualScroll
    })

    checkBox.addEventListener('change', ()=>{//função para trocar o tema do site 
        if(checkBox.checked){
            console.log('clicado');
            Array.from(header).forEach(header => {//array.from server para transformar o header em um array, pois ele retorna um HTML collection, assim devemos acessar cada elemento dessa coleção usando o forEach, que é uma função exclusiva de arrays
                header.style.backgroundColor = 'black';
            });
            Array.from(anchor).forEach(a => {
                a.style.color = 'white';
            });
            Array.from(body).forEach(body => {
                body.style.backgroundColor = 'black';
                body.style.color = 'white';
            });
        } else {
            console.log('clicado de novo');
            Array.from(header).forEach(header => {
                header.style.backgroundColor = 'white';
            });
            Array.from(anchor).forEach(header => {
                header.style.color = 'black';
            });
            Array.from(body).forEach(body => {
                body.style.backgroundColor = 'white';
                body.style.color = 'black';
            });
        }
    });