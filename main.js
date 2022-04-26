window.onload = function () {
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
let isGameActive = false; //inital state is game isnt active
let playersFirstTurn = true;

let playersHand = [];//empyty player hand
let playersHand2 = []; //split hand
let dealersHand = []; //dealers hand

let playerAceCount = 0;
let dealerAceCount = 0;

let playerTotal = 0;
let dealerTotal = 0;
let cardsDealt = 0;

let playerBank;

let runningCount;
let trueCount;
let cardsRemaining;

let gameDeck = [];

let tempCard;


let runningCountIngame = document.getElementById("runningCount");
let playersValueIngame = document.getElementById("playersHandValue");
let hitB = document.getElementById("hitbutton");


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




//onclick events

document.getElementById("dealbutton").addEventListener("click", gameStart)



function gameStart() {
    isGameActive = true; // game has now started
    gameDeck = getDeck(); // populates empty array with 8 shuffled decks

    for (let i = 0; i < 2; i++) {
        let cardImage = document.createElement("img"); //create card image element

        tempCard = gameDeck.pop(); //give the player their first card
        cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
        playersHand.push(tempCard); //push temp card into players hand 
        playerTotal += valueCheck(playersHand, cardsDealt); //player total is updated with correct value
        document.getElementById("playerCardArea").append(cardImage); //card image is added to the page
        cardsDealt++; //incriment how many cards have been dealt 

        console.log(playerTotal);

    }
    console.log(playersHand[cardsDealt - 1]);

    //need to check if player can split by comparing values of cards 1 and 2 to see if they are the same



    let splits = splitCheck(playersHand);
    buttonActive(splits); // load inital gameplay buttons


    //PLAYER FIRST TWO CARDS DONE
    hitB.onclick = function () {
        tempCard = gameDeck.pop(); //give the player their first card
        playersHand.push(tempCard);
        aceCheckPlayer(tempCard);

        playerTotal += valueCheck(playersHand, cardsDealt);
        cardsDealt++;

        console.log(playerTotal);
        resultCheck(playerTotal, aceCheckPlayer);

    }


}


function resultCheck(playerTotal, aceCheckPlayer) {
    if (playerTotal >= 21) {
        console.log("turn end");
    }
}

// function Dealer() {
//     whilst(dealerTotal < 17){

//     }
// }

function valueCheck(playerHand, cardsdealt) {
    let data = playerHand;
    let i = cardsdealt;

    if (data[i].Value == "2") {
        return 2;
    } else if (data[i].Value == "3") {
        return 3;
    } else if (data[i].Value == "4") {
        return 4;
    } else if (data[i].Value == "5") {
        return 5;
    } else if (data[i].Value == "6") {
        return 6;
    } else if (data[i].Value == "7") {
        return 7;
    } else if (data[i].Value == "8") {
        return 8;
    } else if (data[i].Value == "9") {
        return 9;
    } else if (data[i].Value == "10") {
        return 10;
    } else if (data[i].Value == "K") {
        return 10;
    } else if (data[i].Value == "Q") {
        return 10;
    } else if (data[i].Value == "J") {
        return 10;
    } else if (data[i].Value == "A") {
        if (playerTotal + 11 > 21 && playerAceCount > 1) {
            return 1;
        } else {
            return 11;
        }
    }





}

//working
function splitCheck(playersHand) {
    let data = playersHand;


    if (data[0].Value == "2" && data[1].Value == "2") {
        return true;
    } else if (data[0].Value == "3" && data[1].Value == "3") {
        return true;
    } else if (data[0].Value == "4" && data[1].Value == "4") {
        return true;
    } else if (data[0].Value == "5" && data[1].Value == "5") {
        return true;
    } else if (data[0].Value == "6" && data[1].Value == "6") {
        return true;
    } else if (data[0].Value == "7" && data[1].Value == "7") {
        return true;
    } else if (data[0].Value == "8" && data[1].Value == "8") {
        return true;
    } else if (data[0].Value == "9" && data[1].Value == "9") {
        return true;
    } else if (data[0].Count == "-1" && data[0].Value !== "A" && data[1].Count == "-1" && data[1].Value !== "A") {
        return true;
    } else if (data[0].Count == "-1" && data[0].Value == "A" && data[1].Count == "-1" && data[1].Value == "A") {
        return true;
    } else {
        return false;
    }

}
function blackJackCheck(playertotal) {
    if (playertotal == 21) {
        console.log("BLACKJACK");
    }
}

function countCheck(playerHand) {
    let data = playerHand;


    if (data.Value == "2") {
        return 1;
    } else if (data.Value == "3") {
        return 1;
    } else if (data.Value == "4") {
        return 1;
    } else if (data.Value == "5") {
        return 1;
    } else if (data.Value == "6") {
        return 1;
    } else if (data.Value == "7") {
        return 0;
    } else if (data.Value == "8") {
        return 0;
    } else if (data.Value == "9") {
        return 0;
    } else if (data.Value == "10") {
        return -1;
    } else if (data.Value == "K") {
        return -1;
    } else if (data.Value == "Q") {
        return -1;
    } else if (data.Value == "J") {
        return -1;
    } else if (data.Value == "A") {
        return -1;
    }

}

function aceCheckPlayer(card) {
    if (card.Value == "A") {
        playerAceCount++;
    }
}
function buttonActive(splits) {
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

    if (splits == false) {
        splitbuttons.style.opacity = '25%';

    }




}


// Action Functions



