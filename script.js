const cards = document.querySelectorAll(".hero-card");
const message = document.querySelector("#selection-message");
const counter = document.querySelector("#counter");
const confirmHeroButton = document.querySelector("#confirm-hero");
const heroImages = {
  Gwendolyn: "assets/web-hero.svg",
  "Wonder Woman": "assets/star-hero.svg",
  "Captain Marvel": "assets/star-hero.svg",
};

const state = {
  hero: "",
  breed: "Russian Blue",
  colors: ["#2d73b9", "#7bd3e8", "#17202a"],
  activeShade: 0,
  catName: "",
  house: "",
  houseCost: 0,
  balance: 1000,
  defeated: 0,
  crimeBank: 0,
  crimeActive: false,
  xValue: 1,
  powerups: [],
  accessories: [],
};

const screens = document.querySelectorAll(".screen");
const catPreview = document.querySelector("#cat-preview");
const summaryCat = document.querySelector("#summary-cat");
const colorButtons = document.querySelectorAll(".color-swatch");
const shadeTabs = document.querySelectorAll(".shade-tab");
const breedCards = document.querySelectorAll(".breed-card");
const houseCards = document.querySelectorAll(".house-card");
const powerupCards = document.querySelectorAll(".powerup-card");
const accessoryCards = document.querySelectorAll(".accessory-card");
const catNameInput = document.querySelector("#cat-name");
const confirmCatButton = document.querySelector("#confirm-cat");
const buildHouseButton = document.querySelector("#build-house");
const backHouseButton = document.querySelector("#back-house");
const villainField = document.querySelector("#villain-field");
const fightCrimeButton = document.querySelector("#fight-crime");
const fightAgainButton = document.querySelector("#fight-again");
const goShopButton = document.querySelector("#go-shop");
const saveDayButton = document.querySelector("#save-day");

function showScreen(screenId) {
  screens.forEach((screen) => {
    const isCurrent = screen.id === screenId;
    screen.hidden = !isCurrent;
    screen.classList.toggle("is-visible", isCurrent);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatMoney(amount) {
  return `$${amount.toLocaleString()}`;
}

function refreshShop() {
  document.querySelector("#shop-budget").textContent = formatMoney(state.balance);
  document.querySelector("#reward-value").textContent = `Reward: X${state.xValue} × 10`;
  backHouseButton.hidden = !state.house;
  houseCards.forEach((card) => {
    const cost = Number(card.dataset.cost);
    const isOwned = state.house === card.dataset.house;
    const canAfford = isOwned || state.balance >= cost;
    card.disabled = !canAfford;
    card.classList.toggle("is-owned", isOwned);
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
    card.querySelector("small").textContent = isOwned ? "Your current home" : canAfford ? "Ready to build" : `Need ${formatMoney(cost - state.balance)} more`;
    card.querySelector("b").textContent = isOwned ? "Keep this home" : canAfford ? "Pick this one" : "Locked";
  });
  buildHouseButton.disabled = true;
  powerupCards.forEach((card) => {
    if (card.classList.contains("accessory-card")) return;
    const isOwned = state.powerups.includes(card.dataset.powerup);
    const canAfford = state.balance >= 1000;
    card.disabled = isOwned || !canAfford;
    card.classList.toggle("is-owned", isOwned);
    card.setAttribute("aria-pressed", String(isOwned));
    card.querySelector("b").textContent = isOwned ? "Owned · X boosted" : canAfford ? "$1,000 · +5 X" : `Need ${formatMoney(1000 - state.balance)} more`;
  });
  accessoryCards.forEach((card) => {
    const isOwned = state.accessories.includes(card.dataset.accessory);
    const canAfford = state.balance >= 3000;
    card.disabled = isOwned || !canAfford;
    card.classList.toggle("is-owned", isOwned);
    card.setAttribute("aria-pressed", String(isOwned));
    card.querySelector("b").textContent = isOwned ? "Owned · No score impact" : canAfford ? "$3,000" : `Need ${formatMoney(3000 - state.balance)} more`;
  });
}

function updateBuiltScreen() {
  const builtBalance = document.querySelector("#built-balance");
  const builtHouseName = document.querySelector("#built-house-name");
  const builtHeroImage = document.querySelector("#built-hero-image");
  const builtHeroName = document.querySelector("#built-hero-name");
  const builtCatName = document.querySelector("#built-cat-name");
  if (builtBalance) builtBalance.textContent = `${formatMoney(state.balance)} bank`;
  if (builtHouseName) builtHouseName.textContent = state.house;
  if (builtHeroImage) {
    builtHeroImage.src = heroImages[state.hero];
    builtHeroImage.alt = `Illustration of ${state.hero} inside the ${state.house.toLowerCase()}`;
  }
  if (builtHeroName) builtHeroName.textContent = state.hero;
  if (builtCatName) builtCatName.textContent = state.catName.trim();
  const houseScene = document.querySelector("#house-scene");
  houseScene.classList.remove("house-house", "house-mansion", "house-castle");
  houseScene.classList.add(`house-${state.house.toLowerCase()}`);
  houseScene.querySelectorAll(".built-accessory").forEach((accessory) => {
    accessory.hidden = !state.accessories.includes(accessory.dataset.accessory);
  });
  renderCat(document.querySelector("#built-cat"));
}

function renderCat(container) {
  const [primary, secondary, accent] = state.colors;
  const isLongHaired = state.breed === "Maine Coon";
  const isTabby = state.breed === "Orange Tabby";
  const furOutline = isLongHaired ? "M54 169l-13 23 25-5 7 25 18-17 29 12 29-12 18 17 7-25 25 5-13-23" : "M59 176h122";
  const stripes = isTabby ? `<path d="M73 100l20 24M93 92l20 31M147 92l-20 31M167 100l-20 24" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>` : "";

  container.innerHTML = `<svg viewBox="0 0 240 240" role="img" aria-label="${state.breed} cat preview">
    <circle cx="120" cy="120" r="112" fill="${secondary}" stroke="#17202a" stroke-width="7"/>
    <path d="M60 91L67 39l39 35q14-5 28 0l39-35 7 52q18 19 13 52-7 47-73 47t-73-47q-5-33 13-52z" fill="${primary}" stroke="#17202a" stroke-width="7" stroke-linejoin="round"/>
    <path d="${furOutline}" fill="none" stroke="${primary}" stroke-width="7" stroke-linejoin="round"/>
    ${stripes}
    <path d="M92 125q28-24 56 0v38H92z" fill="${accent}" stroke="#17202a" stroke-width="6"/>
    <path d="M103 116l17 13 17-13" fill="none" stroke="#17202a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="94" cy="110" r="8" fill="#17202a"/><circle cx="146" cy="110" r="8" fill="#17202a"/>
    <path d="M120 126v8M108 140q12 9 24 0M72 134l-30-5M72 144l-31 4M168 134l30-5M168 144l31 4" fill="none" stroke="#17202a" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

function refreshCatPreview() {
  document.querySelector("#preview-breed").textContent = state.breed;
  renderCat(catPreview);
}

function updateColorSelection() {
  colorButtons.forEach((button) => {
    button.classList.toggle("is-picked", button.dataset.color === state.colors[state.activeShade]);
  });
  shadeTabs.forEach((tab) => tab.classList.toggle("is-active", Number(tab.dataset.shade) === state.activeShade));
  document.querySelector("#shade-label").textContent = `Shade ${state.activeShade + 1}`;
  refreshCatPreview();
}

function updateCatConfirmation() {
  const hasName = state.catName.trim().length > 0;
  confirmCatButton.disabled = !hasName;
  document.querySelector("#cat-counter").textContent = hasName ? "1 / 1 picked" : "0 / 1 picked";
}

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((otherCard) => {
      const isThisCard = otherCard === card;
      otherCard.classList.toggle("is-selected", isThisCard);
      otherCard.setAttribute("aria-pressed", String(isThisCard));
    });
    state.hero = card.dataset.hero;
    message.innerHTML = `<img class="selection-image" src="${heroImages[state.hero]}" alt="Original public-domain illustration representing ${state.hero}" /><span class="message-icon" aria-hidden="true">✓</span><span>${state.hero} is ready for action!</span>`;
    message.classList.remove("is-ready");
    requestAnimationFrame(() => message.classList.add("is-ready"));
    counter.textContent = "1 / 1 picked";
    confirmHeroButton.disabled = false;
  });
});

confirmHeroButton.addEventListener("click", () => showScreen("cat-screen"));

breedCards.forEach((card) => {
  card.addEventListener("click", () => {
    breedCards.forEach((otherCard) => {
      const isThisCard = otherCard === card;
      otherCard.classList.toggle("is-selected", isThisCard);
      otherCard.setAttribute("aria-pressed", String(isThisCard));
    });
    state.breed = card.dataset.breed;
    document.querySelector("#cat-message span:last-child").textContent = `${state.breed} selected. Now add some color and a name!`;
    refreshCatPreview();
  });
});

shadeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.activeShade = Number(tab.dataset.shade);
    updateColorSelection();
  });
});

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.colors[state.activeShade] = button.dataset.color;
    updateColorSelection();
  });
});

catNameInput.addEventListener("input", (event) => {
  state.catName = event.target.value;
  updateCatConfirmation();
});

confirmCatButton.addEventListener("click", () => {
  document.querySelector("#summary-hero-image").src = heroImages[state.hero];
  document.querySelector("#summary-hero-image").alt = `Illustration representing ${state.hero}`;
  document.querySelector("#summary-hero-name").textContent = state.hero;
  document.querySelector("#summary-cat-name").textContent = state.catName.trim();
  document.querySelector("#summary-cat-breed").textContent = state.breed;
  renderCat(summaryCat);
  showScreen("summary-screen");
});

document.querySelector("#start-adventure").addEventListener("click", (event) => {
  event.currentTarget.disabled = true;
  showScreen("travel-loading");
  window.setTimeout(() => showScreen("shop-screen"), 3000);
});

houseCards.forEach((card) => {
  card.addEventListener("click", () => {
    houseCards.forEach((otherCard) => {
      const isThisCard = otherCard === card;
      otherCard.classList.toggle("is-selected", isThisCard);
      otherCard.setAttribute("aria-pressed", String(isThisCard));
    });
    state.house = card.dataset.house;
    const isOwned = card.classList.contains("is-owned");
    state.houseCost = isOwned ? 0 : Number(card.dataset.cost);
    document.querySelector("#house-message span:last-child").textContent = isOwned ? `${state.house} is already yours. Welcome home!` : `${state.house} selected for $${state.houseCost.toLocaleString()}. Ready to build?`;
    buildHouseButton.textContent = isOwned ? "Return to this house →" : "Build this house →";
    buildHouseButton.disabled = false;
  });
});

buildHouseButton.addEventListener("click", () => {
  if (state.houseCost === 0) {
    updateBuiltScreen();
    document.querySelector("#built-message span:last-child").textContent = `${state.hero} and ${state.catName.trim()} are back home!`;
    fightCrimeButton.hidden = false;
    goShopButton.hidden = true;
    fightAgainButton.hidden = true;
    saveDayButton.hidden = state.house !== "Castle";
    showScreen("built-screen");
    return;
  }
  buildHouseButton.disabled = true;
  showScreen("build-loading");
  window.setTimeout(() => {
    const mansionBonus = state.house === "Mansion" && state.houseCost > 0;
    state.balance -= state.houseCost;
    if (mansionBonus) state.xValue += 10;
    updateBuiltScreen();
    document.querySelector("#built-message span:last-child").textContent = mansionBonus ? `${state.hero} and ${state.catName.trim()} moved into the mansion! X increased by 10 to X${state.xValue}.` : `${state.hero} and ${state.catName.trim()} have moved in!`;
    fightCrimeButton.hidden = false;
    goShopButton.hidden = true;
    fightAgainButton.hidden = true;
    saveDayButton.hidden = state.house !== "Castle";
    showScreen("built-screen");
  }, 3000);
});

function createVillain(canPowerUp = false) {
  const villain = document.createElement("button");
  villain.className = "villain";
  villain.type = "button";
  const hasAllPowerups = ["Shield", "Cape", "Costume"].every((powerup) => state.powerups.includes(powerup));
  const isPoweredUp = canPowerUp && hasAllPowerups && Math.random() < 0.1;
  if (isPoweredUp) villain.classList.add("powered-villain");
  villain.setAttribute("aria-label", isPoweredUp ? "Powered-up bad guy worth a bonus" : "Bad guy");
  villain.textContent = "☠";
  villain.style.setProperty("--x", `${8 + Math.random() * 84}%`);
  villain.style.setProperty("--y", `${8 + Math.random() * 78}%`);
  villain.style.setProperty("--tilt", `${-12 + Math.random() * 24}deg`);
  return villain;
}

function updateCrimeStats() {
  document.querySelector("#defeated-count").textContent = state.defeated;
  document.querySelector("#crime-bank").textContent = formatMoney(state.crimeBank);
  document.querySelector("#villain-count").textContent = villainField.children.length;
}

function finishCrime() {
  if (!state.crimeActive) return;
  state.crimeActive = false;
  state.balance += state.crimeBank;
  updateBuiltScreen();
  const builtMessage = document.querySelector("#built-message span:last-child");
  if (builtMessage) builtMessage.textContent = `Mission complete! You defeated ${state.defeated} bad guys and banked ${formatMoney(state.crimeBank)}. New balance: ${formatMoney(state.balance)}.`;
  fightCrimeButton.hidden = true;
  goShopButton.hidden = false;
  fightAgainButton.hidden = false;
  saveDayButton.hidden = state.house !== "Castle";
  showScreen("built-screen");
}

function startCrime() {
  state.defeated = 0;
  state.crimeBank = 0;
  state.crimeActive = true;
  villainField.innerHTML = "";
  for (let index = 0; index < 10; index += 1) villainField.append(createVillain());
  updateCrimeStats();
  showScreen("crime-screen");
  const startedAt = performance.now();
  const timer = window.setInterval(() => {
    const secondsLeft = Math.max(0, 10 - (performance.now() - startedAt) / 1000);
    document.querySelector("#crime-timer").textContent = secondsLeft.toFixed(1);
    if (secondsLeft <= 0) window.clearInterval(timer);
  }, 100);
  window.setTimeout(finishCrime, 10000);
}

function launchCrimeAdventure() {
  fightCrimeButton.disabled = true;
  showScreen("crime-loading");
  window.setTimeout(() => {
    fightCrimeButton.disabled = false;
    startCrime();
  }, 3000);
}

fightCrimeButton.addEventListener("click", launchCrimeAdventure);
fightAgainButton.addEventListener("click", launchCrimeAdventure);
goShopButton.addEventListener("click", () => {
  refreshShop();
  showScreen("shop-screen");
});
backHouseButton.addEventListener("click", () => {
  updateBuiltScreen();
  fightCrimeButton.hidden = false;
  goShopButton.hidden = true;
  fightAgainButton.hidden = true;
  saveDayButton.hidden = state.house !== "Castle";
  showScreen("built-screen");
});
saveDayButton.addEventListener("click", () => showScreen("celebration-screen"));

powerupCards.forEach((card) => {
  if (card.classList.contains("accessory-card")) return;
  card.addEventListener("click", () => {
    const powerup = card.dataset.powerup;
    if (state.powerups.includes(powerup) || state.balance < 1000) return;
    state.balance -= 1000;
    state.xValue += 5;
    state.powerups.push(powerup);
    refreshShop();
    document.querySelector("#powerup-message span:last-child").textContent = `${powerup} unlocked! Every bad guy is now worth ${state.xValue * 10}.`;
  });
});

accessoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    const accessory = card.dataset.accessory;
    if (state.accessories.includes(accessory) || state.balance < 3000) return;
    state.balance -= 3000;
    state.accessories.push(accessory);
    refreshShop();
    document.querySelector("#accessory-message span:last-child").textContent = `${accessory} added to your house! It does not affect your score.`;
    updateBuiltScreen();
  });
});

villainField.addEventListener("click", (event) => {
  const villain = event.target.closest(".villain");
  if (!villain || !state.crimeActive) return;
  villain.remove();
  state.defeated += 1;
  const baseReward = state.xValue * 10;
  state.crimeBank += villain.classList.contains("powered-villain") ? Math.round(baseReward * 1.25) : baseReward;
  villainField.append(createVillain(true), createVillain(true));
  updateCrimeStats();
});

refreshCatPreview();
updateColorSelection();