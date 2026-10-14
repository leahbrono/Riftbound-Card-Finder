const modal = document.querySelector('#cardModal')
const modalImg = document.querySelector('#modalImg')
const modalName = document.querySelector('#modalName')
const modalSetInfo = document.querySelector('#modalSetInfo')
const modalBadges = document.querySelector('#modalBadges')
const modalStats = document.querySelector('#modalStats')
const modalTextBox = document.querySelector('#modalTextBox')
const modalTags = document.querySelector('#modalTags')

const openCardModal = (card, imageURL) => {
  modalImg.src = imageURL;
  modalName.textContent = card.name;
  
  let setLabel = card.set && card.set.label ? card.set.label : 'Unknown Set';
  let collectorNum = card.collector_number ? ` #${card.collector_number}` : '';
  modalSetInfo.textContent = `${setLabel}${collectorNum}`;

  modalBadges.innerHTML = '';
  if (card.classification) {
    if (card.classification.type) {
      modalBadges.innerHTML += `<span class="badge highlight">${card.classification.type}</span>`;
    }
    if (card.classification.supertype) {
      modalBadges.innerHTML += `<span class="badge">${card.classification.supertype}</span>`;
    }
    if (card.classification.rarity) {
      modalBadges.innerHTML += `<span class="badge">${card.classification.rarity}</span>`;
    }
    if (card.classification.domain && Array.isArray(card.classification.domain)) {
      card.classification.domain.forEach(d => {
        modalBadges.innerHTML += `<span class="badge">${d}</span>`;
      });
    }
  }
  if (card.metadata) {
    if (card.metadata.alternate_art) modalBadges.innerHTML += `<span class="badge">Alternate Art</span>`;
    if (card.metadata.signature) modalBadges.innerHTML += `<span class="badge">Signature</span>`;
  }

  modalStats.innerHTML = '';
  if (card.attributes) {
    ['energy', 'might', 'power'].forEach(attr => {
      if (card.attributes[attr] !== null && card.attributes[attr] !== undefined) {
        modalStats.innerHTML += `
          <div class="stat-box">
            <span class="stat-label">${attr}</span>
            <span class="stat-value">${card.attributes[attr]}</span>
          </div>
        `;
      }
    });
  }

  modalTextBox.textContent = (card.text && card.text.plain) ? card.text.plain : 'No card text available.';

  if (card.tags && card.tags.length > 0) {
    modalTags.textContent = card.tags.map(t => `#${t}`).join(' ');
  } else {
    modalTags.textContent = '';
  }

  if (!modal.matches(':popover-open')) {
    modal.showPopover();
  }
}

export { openCardModal }