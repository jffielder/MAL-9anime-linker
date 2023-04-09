debugger;

console.log("Running extension");

if (window.location.href.includes('9anime') && window.location.href.includes('/watch')) {

  // get title
  var anime_title = document.querySelector('h1.title.d-title');

  // search mal api of title anime
  const anime_data = searchAnime(anime_title);

  searchAnime(anime_title)
  .then(results => {
    console.log(results)
    addLinkToTitle(results.url, )
    }
  )
  .catch(error => console.error(error));
}

async function searchAnime(title) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title.textContent)}`);
  const data = await response.json();
  return data.results;
}

function addLinkToTitle(mal_url, anime_title) {
    // link creation
    var link = document.createElement('a');
    link.href = mal_url;
    link.textContent = anime_title.textContent;

  // transplant
  anime_title.textContent = '';
  anime_title.appendChild(link);
}


// todo:
// figure out the response structure and find a way to get the exact url from the search