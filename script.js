import { openCardModal } from './modal.js';

const searchForm = document.querySelector('#searchForm')
const mainContent = document.querySelector('#content')

searchForm.addEventListener("submit", event => {
  event.preventDefault()

  let searchText = document.querySelector('#searchText').value
  let sortValue = document.querySelector('#raritySort').value

  // 1. Gemini generate this loading message to show while the fetch is in progress
mainContent.innerHTML = '<div class="loading-state">Loading cards...</div>';

  let url = new URL('https://api.riftcodex.com/cards/name')
  url.searchParams.set('fuzzy', searchText)

  fetch(url.href)
    .then(response => response.json())
    .then(response => {
      let items = response.items || []

      if (sortValue) {
        const rarityRank = { 'Epic': 4, 'Rare': 3, 'Uncommon': 2, 'Common': 1 };
        items.sort((a, b) => {
          let rA = (a.classification && a.classification.rarity) ? (rarityRank[a.classification.rarity] || 0) : 0;
          let rB = (b.classification && b.classification.rarity) ? (rarityRank[b.classification.rarity] || 0) : 0;
          
          if (sortValue === 'high-to-low') {
            return rB - rA;
          } else {
            return rA - rB;
          }
        });
      }

      displayResults(items)
    })
    .catch(err => {
      console.error(err);
      mainContent.innerHTML = '<p style="color: white; text-align: center;">Failed to load cards.</p>';
    });
});

const displayResults = (results) => {
  mainContent.innerHTML = '';
  if (results && results.length > 0) {
    results.forEach(result => {
      let div = document.createElement('div');
      div.classList.add('result');

      let imageURL = (result.media && result.media.image_url) ? result.media.image_url : 'placeholder.svg'

      let altArtTag = (result.metadata && result.metadata.alternate_art) ? '<span class="card-tag alt-tag">Alt Art</span>' : '';
      let sigTag = (result.metadata && result.metadata.signature) ? '<span class="card-tag sig-tag">Signature</span>' : '';

      div.innerHTML = `
        <div class="card-image-container">
          <img src="${imageURL}" alt="${result.name}">
          ${altArtTag}
          ${sigTag}
        </div>
        <p class="name">${result.name}</p>
      `;

      div.addEventListener('click', () => openCardModal(result, imageURL));

      mainContent.appendChild(div)
    })
  } else {
    mainContent.innerHTML = '<p style="color: white;">No Results Found</p>';
  }
}

// Automatically load a default set of cards when the website boots up
const loadDefaultCards = () => {
  // Minimal change: Show loading on startup too
  mainContent.innerHTML = '<p style="color: white; text-align: center;">Loading cards...</p>';

  let url = new URL('https://api.riftcodex.com/cards/name')
  url.searchParams.set('fuzzy', 'ahri')

  fetch(url.href)
    .then(response => response.json())
    .then(response => {
      let items = response.items || []
      displayResults(items)
    })
    .catch(err => {
      console.error("Error loading default cards:", err);
      mainContent.innerHTML = '<p style="color: white; text-align: center;">Failed to load cards.</p>';
    })
}

// Trigger the startup load
loadDefaultCards();