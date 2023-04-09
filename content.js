// get score

// add score to scores element

// the intermediate type is the only

// ---------------------




// // const animeTitle = "Attack on Titan"; // replace with your anime title
// const searchUrl = `https://api.jikan.moe/v3/search/anime?q=${animeTitle}`;

// fetch(searchUrl)
//   .then(response => response.json())
//   .then(data => {
//     // handle the response data
//     const anime = data.results[0]; // assuming the first search result is the desired anime
//     console.log(anime.title); // prints the title of the anime
//   })
//   .catch(error => console.error(error));

import { CLIENT_ID, CLIENT_SECRET } from './config.js';

debugger

console.log("Hello");

if (window.location.href.startsWith('https://9anime.to/watch')) {
  
  // get title
  var anime_title = document.querySelector('h1.title.d-title');

  // --- searching for title

  // search mal api of title anime

  const searchTerm = anime_title;


  fetchAnimeTitle(searchTerm)

  fetch(apiUrl, {
    headers: {
      'Authorization': CLIENT_ID
    }
  })
    .then(response => response.json())
    .then(data => {
      // Process the search results here
      const anime = data.results[0]; // assuming the first search result is the desired anime
      console.log(data);
    })
    .catch(error => console.error(error));

    clientID = "0dec2952591b04cf0947d879a5f1cb71"
    client_secret = "6363bdde98bb333a71f2a7f0268f218b242b300907976db3191f714c39061fb4"

  // get mal info on anime

  login(clientID )
  
  
  // link creation
  var link = document.createElement('a');
  link.href = 'https://www.google.com';
  link.textContent = anime_title.textContent;
  
  // transplant
  anime_title.textContent = '';
  anime_title.appendChild(link);
}



function fetchAnimeTitle(title) {

  const apiUrl = `https://api.myanimelist.net/v2/anime?q=${encodeURIComponent(searchTerm)}`;

  const config = {
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
  };

  const params = new URLSearchParams({
    q: title,
  });

  return fetch(`https://api.myanimelist.net/v2/anime?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${config.access_token}`,
    }
  })
  .then(response => response.json())
  .then(data => {
    return data;
  })
  .catch(error => {
    console.error('Error fetching anime title:', error);
  });
}

GET https://myanimelist.net/v1/oauth2/authorize?
response_type=code
&client_id=YOUR_CLIENT_ID
&state=YOUR_STATE
&redirect_uri=YOUR_REDIRECT_URI
&code_challenge=YOUR_PKCE_CODE_CHALLENGE
&code_challenge_method=plain 
HTTP/1.1
Host: YOUR_HOST_URL