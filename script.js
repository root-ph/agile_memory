class AudioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
    }

    flip() {
        this.flipSound.play();
    }

    match() {
        this.matchSound.play();
    }

    victory() {
        this.victorySound.play();
    }

    gameOver() {
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();

    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {

            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;

    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {

        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 3000);
    }

    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }


    getCardType(card) {
        console.log(card)
        console.log(card.getElementsByClassName('card-front')[0].getAttribute('type'))
        return card.getElementsByClassName('card-front')[0].getAttribute('type')
    }


    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    let cards
    ready();
}


function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let menuItems = Array.from(document.getElementsByClassName('menuItem'))
    cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    menuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            document.getElementsByClassName('menu-container')[0].classList.remove('visible')
            $.getJSON("cards.json", (json) => {

                initCards(json[menuItem.classList[1]])
                document.getElementsByClassName('back-button')[0].classList.add('visible')
                document.getElementsByClassName('back-button')[1].classList.add('visible')
                document.getElementsByClassName('game-info-container')[0].classList.add('visible')
                cards.forEach(card => {
                    card.addEventListener('click', () => {
                        game.flipCard(card);
                    });
                });
            })
            game.startGame();
        });
    });
}


function showSolutions(){

    let solutionBox = document.createElement("solution-box")
    solutionBox.classList.add('solutionContainer')

    let el = document.getElementById("game-container");
    let elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);

    cards = Array.from(document.getElementsByClassName('card'));
    cards.forEach(card => {
        card.classList.add('visible')
        card.style.order = null;
        solutionBox.appendChild(card)
    });


    document.getElementsByClassName('game-info-container')[0].classList.remove('visible')
    document.getElementById("game-container").classList.remove('game-container')
    document.getElementById("game-container").appendChild(solutionBox)
}

function initCards(cardArray) {
    console.log(cardArray)
    cardArray.forEach(card => {
        let cardBox = document.createElement("div")
        cardBox.classList.add("card")

        let card_back = document.createElement("div")
        card_back.classList.add("card-back", "card-face")

        let back_image = document.createElement("img")
        back_image.src = "Assets/Images/CardBackend.png"
        back_image.classList.add("spider")

        let card_front = document.createElement("div")
        card_front.classList.add("card-front", "card-face")
        card_front.setAttribute('type', card.type)

        let text = document.createElement("p")
        text.classList.add("card-value")
        text.innerHTML = card.text

        card_back.appendChild(back_image)
        card_front.appendChild(text)
        cardBox.appendChild(card_back)
        cardBox.appendChild(card_front)

        console.log(document.getElementById("game-container"))
        document.getElementById("game-container").appendChild(cardBox)
        cards.push(cardBox)

    })

}