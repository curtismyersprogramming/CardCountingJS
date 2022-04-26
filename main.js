onload = function () {
    let doublebutton = document.getElementById("doublebutton");
    let hitbutton = document.getElementById("hitbutton");
    let standbuttons = document.getElementById("standbutton");
    let splitbuttons = document.getElementById("splitbutton");
    doublebutton.style.display = "none";
    hitbutton.style.display = "none";
    standbuttons.style.display = "none";
    splitbuttons.style.display = "none";
}

//VARIABLES
let suits = ["spades", "diamonds", "clubs", "hearts"]; //All suits that will be used for the deck
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; //All values that cards can be assigned
let isGameActive = false //inital state is game isnt active
//Deck creation



function getDeck() //creates a deck by looping through suits and values creating card objects that is then pushed into an array called deck 
{
    let deck = new Array();

    for (let l = 0; l < 8; l++) { //this loop changes the amount of decks that are created and then pushed into the playable deck meaning we can change how many decks are played with in the game

        for (let i = 0; i < suits.length; i++) {
            for (let x = 0; x < values.length; x++) {
                let card = { Value: values[x], Suit: suits[i], Count: 0 }; //INCLUDE WHICH DECK THE CARD COMES FROM?

                //ASSIGNING CARD A COUNT VALUE

                //High card point values
                if (card.Value == "2" ||
                    card.Value == "3" ||
                    card.Value == "4" ||
                    card.Value == "5" ||
                    card.Value == "6") {
                    card.Count = 1;
                }

                //Low card point values
                if (card.Value == "10" ||
                    card.Value == "J" ||
                    card.Value == "K" ||
                    card.Value == "Q" ||
                    card.Value == "A") {
                    card.Count = -1;
                }

                deck.push(card);
            }
        }
    } //bracket for commented out loop
    shuffle(deck)
    return deck;
}

function shuffle(deck) {

    for (let i = 0; i < 1000; i++) {
        let card1 = Math.floor((Math.random() * deck.length));
        let card2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[card1];
        deck[card1] = deck[card2];
        deck[card2] = tmp;
    }
}

function gameStart() {
    let doublebutton = document.getElementById("doublebutton");
    let hitbutton = document.getElementById("hitbutton");
    let standbuttons = document.getElementById("standbutton");
    let splitbuttons = document.getElementById("splitbutton");
    let dealbutton = document.getElementById("dealbutton");
    doublebutton.style.display = "block";
    hitbutton.style.display = "block";
    standbuttons.style.display = "block";
    splitbuttons.style.display = "block";
    dealbutton.style.display = "none";
}


//onclick events
document.getElementById("dealbutton").addEventListener("click", gameStart);