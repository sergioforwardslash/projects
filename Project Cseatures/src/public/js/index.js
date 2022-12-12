const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

const newProfileModal = new bootstrap.Modal('#profileModal', {
  keyboard: false
});

let currentLoggedInUser = null;
let cardStorage = null;
let existingProf = [];
let inventory = [];
let dataModified = false;
let walletValue = 0;

const saveProfileBtn = document.getElementById('saveProfile');
const saveProgressBtn = document.getElementById('save-progress');
const openProfileBtn = document.getElementById('openProfile');
const signOutBtn = document.getElementById('signOutBtn');
const currentProfileName = document.getElementById('currProfName');
const cardValueDisplay = document.getElementById('cardValue');
const cardNameDisplay = document.getElementById('cardName');
const rollButton = document.getElementById('rollButton');
const previewCardImage = document.getElementById('card-image-id');
const previewCardValue = document.getElementById('card-value-id');
const previewCardName = document.getElementById('card-name-id');
const inventoryRow = document.getElementById('inv-row');

function appendTextAsHtmlToElement(htmlText, element) {
  element.insertAdjacentHTML('beforeend', htmlText);
}

function rollCard() {
  if (cardStorage != null) {
    const rolledCard = cardStorage[Math.floor(Math.random() * cardStorage.length)];

    chargeWalletWithCardValue(20);
    updateDataModified(true);

    updatePreviewCard(rolledCard);
    addCardToProfileInventory(rolledCard);
  }
}

function chargeWalletWithCardValue(value) {
  const wallet = document.getElementById('wallet');

  walletValue -= value;

  wallet.innerText = walletValue.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function updatePreviewCard(card) {
  previewCardImage.src = `./images/${card.ImageURL}`;
  previewCardName.innerText = card.Name;
  previewCardValue.innerText = card.Value.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function addCardToProfileInventory(card) {
  inventory.push(card);

  const templateCard = `
    <div class='rarity-border ${card.Rarity}-border ${card.Rarity === 'Legendary' ? 'shimmer' : ''}'>
      <img class='inventory-card-image' src='./images/${card.ImageURL}' width='140px' height='190px' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-custom-class='custom-tooltip' data-bs-html='true' data-bs-title='placeholder name<br>$0'>
    </div>
  `;

  appendTextAsHtmlToElement(templateCard, inventoryRow);
}

async function updateLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');

  removeAllChildNodes(leaderboard);

  const data = await document.queryDatabase(`
    WITH
      scores AS (
        SELECT
          p.ProfileId,
          p.Username,
          c.Value
        FROM
          profile as p,
          inventory as i,
          card as c
        WHERE
          p.ProfileId = i.ProfileId
          AND i.CardId = c.CardId
      ),
      sumOfValues AS (
        SELECT
          ProfileId,
          Username,
          SUM(Value) AS Score
        FROM
          scores
        GROUP BY
          ProfileId
      )
    SELECT *
    FROM sumOfValues
    ORDER BY Score DESC
  `);

  let count = 1;
  for (const entry of data) {
    const leaderboard = document.getElementById('leaderboard');
    const leaderboardTemplate = `
      <div class="leader-board-entry">
        <div class="leader-board-entry-inner">
          <div class="leader-board-entry-position">
            <p>#${count}</p>
          </div>
          <div class="leader-board-entry-name">
            <p>${entry.Username}</p>
          </div>
          <div class="leader-board-entry-score">
            <p>${entry.Score.toLocaleString('en-US', {
              style: 'currency', currency: 'USD', minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</p>
          </div>
        </div>
      </div>
    `;

    count++;

    appendTextAsHtmlToElement(leaderboardTemplate, leaderboard);
  }
}

async function updateWalletFromDB() {
  const wallet = document.getElementById('wallet');
  const selectedProfile = JSON.parse(sessionStorage.getItem('selectedProfile'));

  const walletResponse = await document.queryDatabase(`
    SELECT CatDollars FROM profile WHERE ProfileId = ${selectedProfile.ProfileId} LIMIT 1
  `);

  walletValue = walletResponse[0].CatDollars;

  wallet.innerText = walletValue.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

async function grabCardInformation() {
  cardStorage = await document.queryDatabase('SELECT * FROM card');
}

function signOut() {
  sessionStorage.removeItem('user');

  redirectToLogin();
}

function redirectToLogin() {
  window.location = 'login.html';
}

function getUsername() {
  currentLoggedInUser = JSON.parse(sessionStorage.getItem('user'));

  return currentLoggedInUser != null;
}

function openProfile() {
  newProfileModal.show();
}

function updateDataModified(isModified) {
  dataModified = isModified;

  if (isModified) {
    const leaveText = 'Are you sure you want to leave before saving? All progress will be lost.';

    window.onbeforeunload = function (e) {
      e = e || window.event;
  
      if (e) {
        e.returnValue = leaveText;
      }
  
      return leaveText;
    };
  } else {
    window.onbeforeunload = null;
  }
}

async function saveProfile() {
  const profileInput = document.getElementById('profileInput');
  const newProfileName = profileInput.value;

  const insertResponse = await document.queryDatabase(`
    INSERT INTO profile (UserId, Username)
      VALUES ('${currentLoggedInUser.UserId}', '${newProfileName}');
  `);

  if (insertResponse.errno) {
    alert('Error creating profile!');
  } else {
    getProfiles();

    profileInput.innerText = '';
    newProfileModal.hide();
  }
}

async function getProfiles() {
  existingProf = await document.queryDatabase(`
    SELECT * FROM profile
      WHERE UserId = '${currentLoggedInUser.UserId}';
  `);

  updateProfileDropdown();
}

async function swapProfile(event) {
  const clickedProfile = {
    Username: event.target.innerHTML,
    ProfileId: event.target.dataset.ProfileId
  }

  sessionStorage.setItem('selectedProfile', JSON.stringify(clickedProfile));

  await updateWalletFromDB();
  await updateProfileButtonText(clickedProfile.Username);
  await updateInventoryWithExisting(clickedProfile);
  await updateLeaderboard();
}

function updateProfileButtonText(buttonText) {
  currentProfileName.innerHTML = buttonText;
}

async function updateProfileDropdown() {
  const profileMenu = document.querySelector('#profileMenu');

  await removeAllChildNodesDropdown(profileMenu);

  for (let profile of existingProf) {
    let ele = document.createElement('a');

    ele.classList = 'dropdown-item profile';
    ele.href = '#';
    ele.innerText = profile.Username;
    ele.dataset.ProfileId = profile.ProfileId;

    profileMenu.appendChild(ele);
  }

  const profileBtns = document.getElementsByClassName('profile');

  for (let element of profileBtns) {
    element.addEventListener('click', swapProfile);
  }
}

async function removeAllChildNodesDropdown(parent) {
  while (parent.lastChild.tagName === 'A') {
    parent.removeChild(parent.lastChild);
  }
}

async function removeAllChildNodes(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
}

async function saveProgress() {
  const selectedProfileId = JSON.parse(sessionStorage.getItem('selectedProfile')).ProfileId;

  const inventorySQL = inventory.map(card => `(${selectedProfileId}, ${card.CardId})`).join(',');

  const updateInventory = await document.queryDatabase(`
    INSERT INTO inventory (ProfileId, CardId)
      VALUES ${inventorySQL}
  `);

  console.log(walletValue);

  const updateWallet = await document.queryDatabase(`
    UPDATE profile
      SET CatDollars = ${walletValue}
    WHERE ProfileId = ${selectedProfileId};
  `);

  console.log(updateWallet);

  updateDataModified(false);

  if (updateInventory.errno || updateWallet.errno) {
    alert('Error saving progress!');
  } else {
    alert('Progress saved!');
  }
}

async function updateInventoryWithExisting(selectedProfile) {
  removeAllChildNodes(inventoryRow);

  const inventorySQL = `
    SELECT * FROM inventory
      INNER JOIN card ON inventory.CardId = card.CardId
    WHERE ProfileId = ${selectedProfile.ProfileId};
  `;

  const inventoryResponse = await document.queryDatabase(inventorySQL);

  for (let card of inventoryResponse) {
    addCardToProfileInventory(card);
  }
}

window.onload = async function () {
  const userLoggedIn = getUsername();

  if (userLoggedIn) {
    await getProfiles();
    await grabCardInformation();

    const selectedProfile = JSON.parse(sessionStorage.getItem('selectedProfile'));
    if (!!selectedProfile) {
      updateProfileButtonText(selectedProfile.Username);
      await updateInventoryWithExisting(selectedProfile);
      await updateWalletFromDB();
      await updateLeaderboard();
    }
  } else {
    redirectToLogin();
  }
}

saveProfileBtn.addEventListener('click', saveProfile);
openProfileBtn.addEventListener('click', openProfile);
signOutBtn.addEventListener('click', signOut);
rollButton.addEventListener('click', rollCard);
saveProgressBtn.addEventListener('click', saveProgress);

/* TO DO:
    Favorite cards
*/