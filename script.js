import cards from "./cards.js";
const gameWrap = document.querySelector(".game-wrap");
const grid = document.createElement("div");
const resetButton = document.querySelector(".reset");
const stepNumber = document.querySelector(".step-number");
const stepWrap = document.querySelector(".step-wrap");

let count = 0;
let step = 0;
let firstChoice = "";
let secondChoice = "";
let matched = [];
const duplicatedCards = cards.concat(cards);
const shuffledCards = duplicatedCards.sort(() => {
	return 0.5 - Math.random();
});

grid.setAttribute("class", "grid");
gameWrap.appendChild(grid);

shuffledCards.map((item) => {
	const card = document.createElement("div");
	card.classList.add("card");
	card.dataset.name = item.name;
	card.style.backgroundImage = `url(${item.img})`;

	const front = document.createElement("div");
	front.classList.add("face");

	grid.appendChild(card);
	card.appendChild(front);
});

const handleClick = (e) => {
	const clickedCard = e.target.closest(".card");
	const same = clickedCard?.classList.contains("selected");

	if (clickedCard && count < 2 && !same) {
		count++;
		checkTwoChoices(clickedCard);
	}
};

const reveal = (clickedCard) => {
	clickedCard.classList.add("selected");
};

const checkTwoChoices = (clickedCard) => {
	// break if you click on already matched card
	if (clickedCard.classList.contains("matched")) {
		count = 0;
		return;
	}
	// set First
	if (count === 1) {
		firstChoice = clickedCard.dataset.name;
		reveal(clickedCard);
	}
	// setSecond
	if (count === 2 && !clickedCard.classList.contains("selected")) {
		secondChoice = clickedCard.dataset.name;
		reveal(clickedCard);
		setTimeout(() => {
			resetCards();
		}, 700);
		step++;
		grid.dispatchEvent(new CustomEvent("stepUpdated"));
	}

	// compare
	if (firstChoice === secondChoice) {
		matchCards();
		setTimeout(() => {
			resetCards();
		}, 700);
	}
};

const renderStep = () => {
	stepNumber.innerText = step;
};

const matchCards = () => {
	const selected = document.querySelectorAll(".selected");
	selected.forEach((card) => {
		card.classList.add("matched");
		matched.push(card);
		grid.dispatchEvent(new CustomEvent("updateMatched"));
	});
};

const resetCards = () => {
	count = 0;
	firstChoice = "";
	secondChoice = "";
	const selected = document.querySelectorAll(".selected");

	selected.forEach((card) => {
		card.classList.remove("selected");
	});
};
const resetGame = () => {
	matched.forEach((card) => {
		card.classList.remove("matched");
	});
	step = 0;
	stepWrap.classList.remove("success");
	grid.dispatchEvent(new CustomEvent("stepUpdated"));
	const successText = document.querySelector(".success-text");
	stepWrap.removeChild(successText);
};

const success = () => {
	stepWrap.classList.add("success");
	const success = document.createElement("span");
	success.setAttribute("class", "success-text");
	success.innerText = "Congrats!";
	stepWrap.prepend(success);
};

grid.addEventListener("click", handleClick);
grid.addEventListener("stepUpdated", renderStep);
grid.addEventListener("updateMatched", () => {
	if (matched.length === shuffledCards.length) {
		success();
	}
});
resetButton.addEventListener("click", () => {
	resetGame();
});
