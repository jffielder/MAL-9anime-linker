// MAL to 9anime Linker Extension
// Copyright (c) 2023 jff-i
// Licensed under the MIT License

// This extension adds a link to the corresponding MyAnimeList (MAL) record on a 9anime anime information page. 
// Simply click on the link to quickly access the MAL page for the anime you're currently viewing on 9anime.
// This extension is not affiliated with either MyAnimeList or 9anime.


/* 
-------- Known Issues --------
Current functionality is very basic and doesn't handle variations in titles from the standard released anime on MAL.
Some things that don't work well and improvements to searching and/or matching functions:
- Super obscure/old titles
- Movies (phrases like "part x" and subtitles throw search off)
- OVAs
- dubs
- Very old
- Unreleased ()

*/
/**
 * Searches for a matching anime title on the 9anime website and adds a link to the MyAnimeList page for that anime.
 *
 * @returns {Promise<void>} A Promise that resolves when the function has finished executing.
 *
 * @example
 * searchAndLinkMAL();
 */
class MAL9Linker {

  async searchAndLinkMAL() {
    if (window.location.href.includes('9anime') && window.location.href.includes('/watch')) {

      var anime_titles_element = document.querySelector('div.names.font-italic.mb-2');
      var anime_titles_array = anime_titles_element.textContent.split('; ');
      var matched = false

      this.searchAnime(this.removeSpecialChars(anime_titles_array[0]))
        .then(results => {
          console.log(results)

          if (Array.isArray(results) && results.length >= 1) {
            for (let i = 0; i < results.length && !matched; i++) {
              for (let j = 0; j < anime_titles_array.length && !matched; j++) {

                // compare titles
                console.log(`Comparing ${results[i].title} and ${anime_titles_array[j]}`)
                if (this.compareTitles(results[i], anime_titles_array[j])) {
                  
                  // validate link
                  this.testAnimeURL(results[i].mal_id)
                    .then(isValidURL => {
                      if (isValidURL) {
                        matched = true;
                        console.log(results[i].url)

                        // link is inserted to title
                        this.addLinkToTitle(results[i].url, anime_titles_element)
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
  }
  /**
   * Searches for an anime on MyAnimeList using the jikan API based on the given title string.
   *
   * @param {string} title_str - The title string to search for on MyAnimeList.
   * @returns {Promise<Array>} Returns a promise that resolves to an array of anime objects that match the search query.
   *
   * @example
   * searchAnime('Cowboy Bebop').then(anime_list => {
   *   console.log(`Found ${anime_list.length} anime that match the search query.`);
   *   console.log(anime_list);
   * });
   */
  async searchAnime(title_str) {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title_str)}`);
    const data = await response.json();
    return data.data;
  }


  /**
   * Tests the validity of a MyAnimeList URL for a given anime ID.
   * TODO: If link fails, use this function for defaulting the link to a MAL page, preferably the search results page. 
   *
   * @param {number} id - The ID of the anime on MyAnimeList.
   * @returns {Promise<boolean>} Returns a promise that resolves to true if the anime exists on MyAnimeList, otherwise resolves to false.
   *
   * @example
   * testAnimeURL(1).then(result => {
   *   if (result) {
   *     console.log('Anime exists on MyAnimeList');
   *   } else {
   *     console.log('Anime does not exist on MyAnimeList');
   *   }
   * });
   */
  async testAnimeURL(id) {
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

  /**
   * Compares the title or title_english property of the result_title object with the page_title string.
   *
   * @param {Object} result_title - An object containing the title and title_english properties.
   * @param {string} page_title - The title string to compare with the result_title.
   * @returns {boolean} Returns true if the title or title_english property of the result_title object matches with the page_title string, otherwise returns false.
   *
   * @example
   * compareTitles({title: 'The Lion King', title_english: 'The Lion King'}, 'The Lion King');
   * // Returns true
   */
  compareTitles(result_title, page_title) {
    if (result_title.title === page_title || result_title.title_english === page_title) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds a link to the given MAL URL to the anime_title_html_element.
   *
   * @param {string} mal_url - The URL of the anime on MyAnimeList.
   * @param {HTMLElement} anime_title_html_element - The HTML element to which the link will be added.
   *
   * @example
   * var mal_url = 'https://myanimelist.net/anime/1/Cowboy_Bebop';
   * var anime_title_html_element = document.getElementById('anime-title');
   * addLinkToTitle(mal_url, anime_title_html_element);
   */
  addLinkToTitle(mal_url, anime_title_html_element) {
    // link creation
    var link = document.createElement('a');
    link.href = mal_url;
    link.textContent = anime_title_html_element.textContent;
    link.target = "_blank"; // open a new tab

    // transplant
    anime_title_html_element.textContent = '';
    anime_title_html_element.appendChild(link);
  }

  /**
   * Removes special characters from a string, replacing them with spaces or removing them altogether.
   * There seems to have been issues searching certain titles when these characters are present.
   *
   * @param {string} str - The string to remove special characters from.
   * @returns {string} Returns the input string with special characters removed and replaced with spaces, or removed altogether.
   */
  removeSpecialChars(str) {
    return str.replace(/[^\w\s]|_/g, " ")
              .replace(/\s+/g, " ")
              .replace(/[^\w\s]/g, "");
  }
}


const m9 = new MAL9Linker();
m9.searchAndLinkMAL();