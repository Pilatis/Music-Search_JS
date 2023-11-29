const from = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const apiURL = "https://api.lyrics.ovh";//Variável com uma API de endereços de músicas

async function searchSongs(term) {//função searchSongs que recebe o parametro term
    const res = await fetch(`${apiURL}/suggest/${term}`);//requisição HTTP
    const data = await res.json();//res.json() converte a resposta HTTP em formato JSON. dados convertidos para JSON são passados como argumento para a função showData.

    showData(data);//é uma função que recebe os dados obtidos da resposta da requisição HTTP.
}
//o async antes da função indica que está função será assíncrona, permitindo o uso de await
//O await antes do fetch indica que o código espera até que a requisição HTTP seja concluída e retorne uma resposta. ai sim para passar para a próxima linha.
//Transformar dados para JSON é transformar os dados para objetos js ou array.
//Pois é um formato leve de troca de dados e mais funcional

function showData(data) {
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          (song) => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join("")}
    </ul>
   `;
    if (data.prev || data.next) {
      more.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" "onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ""
        }
      `;
    } else {
      more.innerHTML = "";
    }
  }//result.innerHTML: define o conteudo HTML da variavel result
  //data.data.map está mapeando os dados recebidos paraq cirar uma entrada de lista.
  //Que exibe o nome do artista o titulo e o botao para pergar a letra da música
  // botões "Prev" e "Next" que, ao serem clicados, invocam a função getMoreSongs() com os URLs correspondentes para carregar mais músicas.

async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
}

async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if (data.error) { //verifica se há erro nos dados recebidos da API. se `data.error` existir e não for null o if sera executado
        result.innerHTML = data.error;
    } else { //Se houver erro o código else sera executado
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");//substitui as quebras de linha encontrado no `data.lyrics` por tags <br> e é feito usando o método replace()

        result.innerHTML = `
           <h2><strong>${artist}</strong> - ${songTitle}</h2>
           <span>${lyrics}</span>
        `;//Atribui o HTML formatado para as letras de músicas do result
    }

    more.innerHTML = ""
}

form.addEventListener('submit', (e) => {//ouvinte de evento de submissão de form
    e.preventDefault();//previne o comportamento padrao de recarregar a página

    const searchTerm = search.value.trim();//Obtém o valor do campo de entrada `input` com o id `search`. O método `trim()` remove espaços em branco na string inserida

    if (!searchTerm) {//verifica se está vazio
        alert('Please type in a search term"')
    } else {
        searchSongs(searchTerm)//Se o `serachTerm` não estiver vazio chama a função `searchSongs(searchTerm)` passa o termo da pesquisa como argumento.
        //Iniciando a busca por música correspondentes
    }
})//Está controlando o comportamento de submissão do formulario

result.addEventListener('click', (e) => {
    const clickedEl = e.target;

    if (clickedEl.tagName === "BUTTON") {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute("data-songTitle");

        getLyrics(artist, songTitle)
    }
})

