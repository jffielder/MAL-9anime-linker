// gets anime titles, replaces title with link to mal
debugger

console.log("Running extension");

if (window.location.href.includes('9anime') && window.location.href.includes('/watch')) {

  var anime_titles_element = document.querySelector('div.names.font-italic.mb-2');
  var anime_titles_array = anime_titles_element.textContent.split('; ');
  var matched = false

  searchAnime(removeSpecialChars(anime_titles_array[0]))
    .then(results => {
      console.log(results)

      if (Array.isArray(results) && results.length >= 1) {
        for (let i = 0; i < results.length && !matched; i++) {
          for (let j = 0; j < anime_titles_array.length && !matched; j++) {

            // compare titles
            console.log(`Comparing ${results[i].title} and ${anime_titles_array[j]}`)
            if (compareTitles(results[i], anime_titles_array[j])) {
              testAnimeURL(results[i].mal_id)
                .then(isValidURL => {
                  if (isValidURL) {
                    matched = true;
                    console.log(results[i].url)
                    addLinkToTitle(results[i].url, anime_titles_element)
                  }
                }
                )
                .catch(error => console.log(error));
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

async function testAnimeURL(id) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  const data = await response.json();
  console.log(`testing id: ${id}`)
  console.log(data)
  if (data.status === 404) {
    return false
  } else {
    return true
  }
}

function compareTitles(result_title, page_title) {
  if (result_title.title === page_title || result_title.title_english === page_title) {
    return true;
  } else {
    return false;
  }
}

function addLinkToTitle(mal_url, anime_title_html_element) {
  // link creation
  var link = document.createElement('a');
  link.href = mal_url;
  link.textContent = anime_title_html_element.textContent;
  link.target = "_blank"; // open a new tab

  // transplant
  anime_title_html_element.textContent = '';
  anime_title_html_element.appendChild(link);
}


function removeSpecialChars(str) {
  return str.replace(/[^\w\s]|_/g, " ")
            .replace(/\s+/g, " ")
            .replace(/[^\w\s]/g, "");
}



/* ------- Known Failures --------
Yuuki Yuuna wa Yuusha de Aru: Yuushashi Gaiten; Yuki Yuna Is a Hero: Hero History Apocrypha
https://9anime.to/watch/yuuki-yuuna-wa-yuusha-de-aru-yuushashi-gaiten.vv772/ep-1

Kokoro Yohou; Heart Forecast
https://9anime.to/watch/heart-forecast.w1ok7/ep-1



*/