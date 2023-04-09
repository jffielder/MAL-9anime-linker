// gets anime titles, replaces title with link to mal

console.log("Running extension");

if (window.location.href.includes('9anime') && window.location.href.includes('/watch')) {

  var anime_titles_element = document.querySelector('div.names.font-italic.mb-2');
  var anime_titles_array = anime_titles_element.textContent.split('; ');
  var matched = false

  searchAnime(anime_titles_array[0])
    .then(results => {
      console.log(results)

      if (Array.isArray(results) && results.length >= 1) {
        for (let i = 0; i < results.length && !matched; i++) {
          for (let j = 0; j < anime_titles_array.length && !matched; j++) {

            // compare titles
            if (results[i].title === anime_titles_array[j] || results[i].title_english === anime_titles_array[j]) {
              if (results[i].year === null) {
                break;
              }
              matched = true;
              console.log(results[i].url)
              addLinkToTitle(results[i].url, anime_titles_element)
            }
          }
        }
      } else {
        console.log("Lookup yielded no results")
      }
    }
    )
    .catch(error => console.error(error));
}


async function searchAnime(title_str) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title_str)}`);
  const data = await response.json();
  return data.data;
}

function addLinkToTitle(mal_url, anime_title_html_element) {
  // link creation
  var link = document.createElement('a');
  link.href = mal_url;
  link.textContent = anime_title_html_element.textContent;

  // transplant
  anime_title_html_element.textContent = '';
  anime_title_html_element.appendChild(link);
}