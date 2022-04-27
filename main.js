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
//Deck Creation
let suits = ["spades", "diamonds", "clubs", "hearts"]; //All suits that will be used for the deck
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; //All values that cards can be assigned

let isGameActive = false; //inital state is game isnt active
let playersFirstTurn = true;

// Arrays to hold catds
let playersHand = [];//empyty player hand
let playersHand2 = []; //split hand
let dealersHand = []; //dealers hand

//ingame totals
let playerTotal = 0;
let dealerTotal = 0;


let playerAceCount = 0;
let dealerAceCount = 0;
let cardsDealtPlayer = 0;
let cardsDealtDealer = 0;
let playerFirstTurn = 0;

let playerBank;

let runningCount = 0;
let trueCount = 0;
let cardsRemaining;

let tempCard;

let cardCountValue = 0;


let runningCountIngame = document.getElementById("runningCount");
let playersValueIngame = document.getElementById("playersHandValue");
let playerFeedbackBackground = document.getElementById("grid-item-feedback")
let playerFeedback = document.getElementById("playerFeedback");
let hitB = document.getElementById("hitbutton");
let standB = document.getElementById("standbutton");
let doubleB = document.getElementById("doublebutton");
let cardsLeft = document.getElementById("deckRemaining");


const delay = ms => new Promise(res => setTimeout(res, ms));


let gameShoe = getDeck(); // populates empty array with 8 shuffled decks

let cutCard = Math.floor(Math.random() * (125 - 75 + 1) + 75); // random value between 75 and 125

//Deck creation - Complete
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

//Shuffle Deck - complete
function shuffle(deck) {

    for (let i = 0; i < 1000; i++) {
        let card1 = Math.floor((Math.random() * deck.length));
        let card2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[card1];
        deck[card1] = deck[card2];
        deck[card2] = tmp;
    }
}

function aceCheckPlayer(playerHand) {
    for (let i = 0; i < playerHand.length; i++)
        if (playerHand[i].Value == "A") {
            playerTotal -= 10;
            playerAceCount -= 1;

        }
}

function aceCheckDealer(dealersHand) {
    for (let i = 0; i < dealersHand.length; i++)
        if (dealersHand[i].Value == "A") {
            dealerTotal -= 10;
            dealerAceCount -= 1;

        }
}


//GAME START EVENT - complete
document.getElementById("dealbutton").addEventListener("click", gameStart)

// Game logic - incomplete
function gameStart() {
    hitB.disabled = false;
    standB.disabled = false;
    doubleB.disabled = false;
    playerAceCount = 0;
    dealerAceCount = 0;


    cardsRemainingUpdate();
    document.getElementById('dealerCardArea').innerHTML = '';
    document.getElementById('playerCardArea').innerHTML = '';

    //Give player their first two cards in hand - complete & working
    for (let i = 0; i < 2; i++) { // for loop of how many cards to give 
        let cardImage = document.createElement("img"); //create card image element
        cardImage.setAttribute("id", "card")
        tempCard = gameShoe.pop(); //Hold value in a temporary card
        if (tempCard.Value == "A") {
            playerAceCount++;
        }
        cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
        playersHand.push(tempCard); //push temp card into players hand - player now has 1 card
        playerTotal += valueCheck(playersHand, cardsDealtPlayer); //check the value of card and add to the player total
        runningCount += runningCountCheck(playersHand, cardsDealtPlayer);
        runningCountIngame.innerHTML = runningCount;
        document.getElementById("playerCardArea").append(cardImage); //card image is added to the page
        cardCountValue = tempCard.Count;
        document.getElementById("playerCardArea").append(cardCountValue); //card image is added to the page
        cardsDealtPlayer++; //incriment how many cards have been dealt 
        if (playerTotal > 21 && playerAceCount >= 1) {
            aceCheckPlayer(playersHand)
        }

        PlayerHandUpate(playerTotal);
        cardsRemainingUpdate();

        console.log(playerTotal);


    }



    //Give Dealer first two cards(one hidden) - Complete

    let cardImage = document.createElement("img"); //create card image element
    cardImage.setAttribute("id", "card")
    tempCard = gameShoe.pop(); //give the dealer their first card
    if (tempCard.Value == "A") {
        dealerAceCount++;
    }
    cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
    dealersHand.push(tempCard); //push temp card into players hand 
    dealerTotal += valueCheck(dealersHand, cardsDealtDealer); //player total is updated with correct value
    runningCount += runningCountCheck(dealersHand, cardsDealtDealer);
    runningCountIngame.innerHTML = runningCount;
    document.getElementById("dealerCardArea").append(cardImage); //card image is added to the page
    cardCountValue = tempCard.Count;
    document.getElementById("dealerCardArea").append(cardCountValue); //card image is added to the page
    if (dealerTotal > 21 && dealerAceCount >= 1) {
        aceCheckDealer(dealersHand)
    }
    cardsDealtDealer++; //incriment how many cards have been dealt 
    DealerHandUpate(dealerTotal);
    cardsRemainingUpdate();


    // CREATE HIDDEN DEALER CARD - complete
    let cardImageback = document.createElement("img"); //create card image element
    let hiddenCard = gameShoe.pop();
    cardImageback.src = "assets/png/cardback.png"; //get card image asset of back of card.
    cardImageback.setAttribute('id', 'back');

    document.getElementById("dealerCardArea").append(cardImageback); //card image is added to the page
    cardsRemainingUpdate();
    // cardsDealtDealer++; //incriment how many cards have been dealt 
    console.log(dealerTotal);





    //ACTIONB BUTTONS

    //need to check if player can split by comparing values of cards 1 and 2 to see if they are the same

    let splits = splitCheck(playersHand); //function returns if the players card can be split
    buttonActive(splits); // adjust button availability dependent on if they can be split


    //HIT
    hitB.onclick = function () {
        //Adds a new card to the players hand 
        playerFirstTurn++;

        let action = "hit";
        playerChoiceFeedback(action);
        let cardImage = document.createElement("img"); //create card image element
        tempCard = gameShoe.pop(); //give the player their first card
        if (tempCard.Value == "A") {
            playerAceCount++;
        }

        cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
        playersHand.push(tempCard); //push temp card into players hand 
        playerTotal += valueCheck(playersHand, cardsDealtPlayer); //player total is updated with correct value
        runningCount += runningCountCheck(playersHand, cardsDealtPlayer);
        runningCountIngame.innerHTML = runningCount;
        document.getElementById("playerCardArea").append(cardImage); //card image is added to the page
        cardCountValue = tempCard.Count;
        document.getElementById("playerCardArea").append(cardCountValue); //card image is added to the page

        cardsDealtPlayer++; //incriment how many cards have been dealt 
        if (playerTotal > 21 && playerAceCount >= 1) {
            aceCheckPlayer(playersHand)
        }
        PlayerHandUpate(playerTotal);



        cardsRemainingUpdate();

        if (playerFirstTurn = 2) {
            doubleB.disabled = true;
            doubleB.style.opacity = "25%";
        }


        //Once card has been added what to do
        if (playerTotal >= 21) { // if player total is greater than or equal to 21
            // disabled ability to use any buttons until dealers turn is over
            hitB.disabled = true;
            standB.disabled = true;
            //remove the image of the back of the card 
            document.getElementById("back").remove(cardImage);
            //start the dealers turn with the dealers information
            Dealer(dealerTotal, dealersHand, dealerAceCount, hiddenCard);

        }

    }


    //STAND
    standB.onclick = function () {
        let action = "stand";
        playerChoiceFeedback(action);
        document.getElementById("back").remove(cardImage);
        Dealer(dealerTotal, dealersHand, dealerAceCount, hiddenCard);
    }



    doubleB.onclick = function () {
        //Adds a new card to the players hand 
        playerFirstTurn = false;
        let action = "double";
        playerChoiceFeedback(action);
        let cardImage = document.createElement("img"); //create card image element
        tempCard = gameShoe.pop(); //give the player their first card
        if (tempCard.Value == "A") {
            playerAceCount++;
        }
        cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
        playersHand.push(tempCard); //push temp card into players hand 
        playerTotal += valueCheck(playersHand, cardsDealtPlayer); //player total is updated with correct value
        runningCount += runningCountCheck(playersHand, cardsDealtPlayer);
        runningCountIngame.innerHTML = runningCount;
        document.getElementById("playerCardArea").append(cardImage); //card image is added to the page
        cardCountValue = tempCard.Count;
        document.getElementById("playerCardArea").append(cardCountValue); //card image is added to the page
        if (playerTotal > 21 && playerAceCount >= 1) {
            aceCheckDealer(playersHand)
        }
        cardsDealtPlayer++; //incriment how many cards have been dealt 
        PlayerHandUpate(playerTotal);
        cardsRemainingUpdate();
        hitB.disabled = true;
        standB.disabled = true;
        document.getElementById("back").remove(cardImage);
        Dealer(dealerTotal, dealersHand, dealerAceCount, hiddenCard);
    }

}

// DEALER FUNCTIONALITY - incomplete
async function Dealer(dealerTotal, dealersHand, dealerAceCount, hiddenCard) {




    // Flip the dealers hidden card and add to their hand - complete
    let cardImage = document.createElement("img"); //create card image element
    cardImage.src = "assets/png/" + hiddenCard.Value + "_of_" + hiddenCard.Suit + ".png"; //get card image asset of temp card
    if (hiddenCard.Value == "A") {
        dealerAceCount++;
    }
    dealersHand.push(hiddenCard); //push temp card into players hand 
    dealerTotal += valueCheck(dealersHand, cardsDealtDealer); //player total is updated with correct value
    runningCount += runningCountCheck(dealersHand, cardsDealtDealer);
    runningCountIngame.innerHTML = runningCount;
    document.getElementById("dealerCardArea").append(cardImage); //card image is added to the page
    cardCountValue = tempCard.Count;
    document.getElementById("dealerCardArea").append(cardCountValue); //card image is added to the page
    cardsDealtDealer++; //incriment how many cards have been dealt 
    if (dealerTotal > 21 && dealerAceCount >= 1) {
        aceCheckDealer(dealersHand)
    }
    DealerHandUpate(dealerTotal);
    console.log(dealerTotal);


    await sleep(1000);

    //dealer draws until 17 or higher - complete
    while (dealerTotal <= 17) {

        // if dealer totaal greater than or equal to 17 dont draw cards



        // if under 17 add cards until condition is false
        let cardImage = document.createElement("img"); //create card image element
        tempCard = gameShoe.pop(); //give the player their first card
        if (tempCard.Value == "A") {
            dealerAceCount++;
        }

        cardImage.src = "assets/png/" + tempCard.Value + "_of_" + tempCard.Suit + ".png"; //get card image asset of temp card
        dealersHand.push(tempCard); //push temp card into players hand 
        if (dealerAceCount >= 1) {
            aceCheckDealer(dealersHand)
        }
        dealerTotal += valueCheck(dealersHand, cardsDealtDealer); //player total is updated with correct value
        runningCount += runningCountCheck(dealersHand, cardsDealtDealer);
        runningCountIngame.innerHTML = runningCount;
        document.getElementById("dealerCardArea").append(cardImage); //card image is added to the page
        cardCountValue = tempCard.Count;
        document.getElementById("dealerCardArea").append(cardCountValue); //card image is added to the page
        if (dealerTotal > 21 && dealerAceCount >= 1) {
            aceCheckDealer(dealersHand)
        }
        cardsDealtDealer++; //incriment how many cards have been dealt
        DealerHandUpate(dealerTotal);
        console.log(dealerTotal);
        cardsRemainingUpdate();
        await sleep(1000);



    }

    await sleep(1000);

    // compare scores once dealer is over 17 to get game outcome - working on - need to change to actual outcomes but currently works
    let gameResult = resultCheck(dealerTotal, playerTotal);
    if (gameResult == 2) {
        console.log("d win");
    } else if (gameResult == 1) {
        console.log("p win");
    } else if (gameResult == 3) {
        console.log("push");
    }


    //reset ready for next hand

    resetHand();
    //resart the game 

    let doublebutton = document.getElementById("doublebutton");
    let hitbutton = document.getElementById("hitbutton");
    let standbuttons = document.getElementById("standbutton");
    let splitbuttons = document.getElementById("splitbutton");
    doublebutton.style.display = "none";
    hitbutton.style.display = "none";
    standbuttons.style.display = "none";
    splitbuttons.style.display = "none";
    dealbutton.style.display = "block";
    document.getElementById("dealbutton").addEventListener("click", gameStart)







}

async function resetHand() {

    // await sleep(500);
    //clear the gameboard



    //reset scores
    playerTotal = 0;
    dealerTotal = 0;

    //reset hands
    playersHand = [];
    dealersHand = [];
    playerFirstTurn = 0;

    cardsDealtPlayer = 0; //reset the amount of cards that the player has put into their hands to 0
    cardsDealtDealer = 0; //reset the amount of cards that the dealer has put into their hands to 0

    let dealerTotalVar = document.getElementById("dealersHandValue");
    dealerTotalVar.innerHTML = dealerTotal;

    let playerTotalVar = document.getElementById("playersHandValue");
    playerTotalVar.innerHTML = playerTotal;
    hasCutCardBeenPassed();
    trueCountUpdate();




}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        return 11;
    }
}






function runningCountCheck(playerHand, cardsdealt) {
    let data = playerHand;
    let i = cardsdealt;

    if (data[i].Value == "2") {
        return 1;
    } else if (data[i].Value == "3") {
        return 1;
    } else if (data[i].Value == "4") {
        return 1;
    } else if (data[i].Value == "5") {
        return 1;
    } else if (data[i].Value == "6") {
        return 1;
    } else if (data[i].Value == "7") {
        return 0;
    } else if (data[i].Value == "8") {
        return 0;
    } else if (data[i].Value == "9") {
        return 0;
    } else if (data[i].Value == "10") {
        return -1;
    } else if (data[i].Value == "K") {
        return -1;
    } else if (data[i].Value == "Q") {
        return -1;
    } else if (data[i].Value == "J") {
        return -1;
    } else if (data[i].Value == "A") {
        return -1;
    }
}







// GAME RESULT LOGIC 
function resultCheck(dealerTotal, playerTotal) {
    let playerWin = 1;
    let dealerWin = 2;
    let push = 3;

    if (playerTotal > dealerTotal && playerTotal <= 21) {
        return playerWin;
    } else if (playerTotal > 21 && dealerTotal > 21 && playerTotal == dealerTotal) {
        return push;

    } else if (playerTotal <= 21 && dealerTotal > 21) {
        return playerWin;
    } else if (playerTotal > 21 && dealerTotal < 21) {
        return dealerWin;
    } else if (playerTotal < dealerTotal && dealerTotal <= 21) {
        return dealerWin;
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
function PlayerHandUpate(playerTotal) {
    let playerTotalVar = document.getElementById("playersHandValue")
    playerTotalVar.innerHTML = playerTotal;

}

function DealerHandUpate(dealerTotal) {
    let dealerTotalVar = document.getElementById("dealersHandValue")
    dealerTotalVar.innerHTML = dealerTotal;

}

function cardsRemainingUpdate() {
    cardsLeft.innerHTML = Math.round(gameShoe.length / 52);
}

function hasCutCardBeenPassed() {
    if (gameShoe.length < cutCard) {
        gameShoe = getDeck();
        runningCount = 0;
        trueCount = 0;
    }
}

function playerChoiceFeedback(playerMove) {
    //HARD Totals

    //HIT - COMPLETE
    if (playerMove == "hit") {
        if (playerTotal <= 8 && dealerTotal >= 2) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }
        //9 - 2,7,8,9,10,11 - HIT
        else if (playerTotal == 9 && dealerTotal == 2 || playerTotal == 9 && dealerTotal == 7 || playerTotal == 9 && dealerTotal == 8 || playerTotal == 9 && dealerTotal == 9 || playerTotal == 9 && dealerTotal == 10 || playerTotal == 9 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }
        //9 - 3,4,5,6 - DOUBLE DOWN
        else if (playerTotal == 9 && dealerTotal == 3 || playerTotal == 9 && dealerTotal == 4 || playerTotal == 9 && dealerTotal == 5 || playerTotal == 9 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";
        }
        //10 - 10,11 - HIT
        else if (playerTotal == 10 && dealerTotal == 10 || playerTotal == 10 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }
        //10 - 2,3,4,5,6,7,8,9 - DOUBLE DOWN
        else if (playerTotal == 10 && dealerTotal == 2 || playerTotal == 10 && dealerTotal == 3 || playerTotal == 10 && dealerTotal == 4 || playerTotal == 10 && dealerTotal == 5 || playerTotal == 10 && dealerTotal == 6 || playerTotal == 10 && dealerTotal == 7 || playerTotal == 10 && dealerTotal == 8 || playerTotal == 10 && dealerTotal == 9) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";

        }
        //11 - everything - Double
        else if (playerTotal == 11 && dealerTotal == 2 || playerTotal == 11 && dealerTotal == 3 || playerTotal == 11 && dealerTotal == 4 || playerTotal == 11 && dealerTotal == 5 || playerTotal == 11 && dealerTotal == 6 || playerTotal == 11 && dealerTotal == 7 || playerTotal == 11 && dealerTotal == 8 || playerTotal == 11 && dealerTotal == 9 || playerTotal == 11 && dealerTotal == 10 || playerTotal == 11 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";
        }
        //12 - 2,3,7,8,9,10,11 = hit
        else if (playerTotal == 12 && dealerTotal == 2 || playerTotal == 12 && dealerTotal == 3 || playerTotal == 12 && dealerTotal == 7 || playerTotal == 12 && dealerTotal == 8 || playerTotal == 12 && dealerTotal == 9 || playerTotal == 12 && dealerTotal == 10 || playerTotal == 12 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: hit"
            playerFeedbackBackground.style.background = "green";
        }
        //12 - 4,5,6 - stand - stand
        else if (playerTotal == 12 && dealerTotal == 4 || playerTotal == 12 && dealerTotal == 5 || playerTotal == 12 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }

        //13 - 2,3,4,5,6 - STAND
        else if (playerTotal == 13 && dealerTotal == 2 || playerTotal == 13 && dealerTotal == 3 || playerTotal == 13 && dealerTotal == 4 || playerTotal == 13 && dealerTotal == 5 || playerTotal == 13 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }
        //13 - 7,8,9,10,11 - hit
        else if (playerTotal == 13 && dealerTotal == 7 || playerTotal == 13 && dealerTotal == 8 || playerTotal == 13 && dealerTotal == 9 || playerTotal == 13 && dealerTotal == 10 || playerTotal == 13 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }

        //14 - 2,3,4,5,6 - STAND
        else if (playerTotal == 14 && dealerTotal == 2 || playerTotal == 14 && dealerTotal == 3 || playerTotal == 14 && dealerTotal == 4 || playerTotal == 14 && dealerTotal == 5 || playerTotal == 14 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }
        //14 - 7,8,9,19,11 - hit
        else if (playerTotal == 14 && dealerTotal == 7 || playerTotal == 14 && dealerTotal == 8 || playerTotal == 14 && dealerTotal == 9 || playerTotal == 14 && dealerTotal == 10 || playerTotal == 14 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }

        //15 - 2,3,4,5,6 - STAND
        else if (playerTotal == 15 && dealerTotal == 2 || playerTotal == 15 && dealerTotal == 3 || playerTotal == 15 && dealerTotal == 4 || playerTotal == 15 && dealerTotal == 5 || playerTotal == 15 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }
        //15 - 7,8,9,10,11 - hit
        else if (playerTotal == 15 && dealerTotal == 7 || playerTotal == 15 && dealerTotal == 8 || playerTotal == 15 && dealerTotal == 9 || playerTotal == 15 && dealerTotal == 10 || playerTotal == 15 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }
        //16 - 2,3,4,5,6 - STAND
        else if (playerTotal == 16 && dealerTotal == 2 || playerTotal == 16 && dealerTotal == 3 || playerTotal == 16 && dealerTotal == 4 || playerTotal == 16 && dealerTotal == 5 || playerTotal == 16 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }
        //16 - 7,8,9,10,11 - hit
        else if (playerTotal == 16 && dealerTotal == 7 || playerTotal == 16 && dealerTotal == 8 || playerTotal == 16 && dealerTotal == 9 || playerTotal == 16 && dealerTotal == 10 || playerTotal == 16 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Hit <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "green";
        }
        //17 - stand everything 
        else if (playerTotal >= 17 && dealerTotal >= 2) {
            playerFeedback.innerHTML = "You Hit<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "red";
        }

    }


    //STAND
    if (playerMove == "stand") {
        if (playerTotal <= 8 && dealerTotal > 2) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }
        //9 - 2,7,8,9,10,11 - HIT
        else if (playerTotal == 9 && dealerTotal == 2 || playerTotal == 9 && dealerTotal == 7 || playerTotal == 9 && dealerTotal == 8 || playerTotal == 9 && dealerTotal == 9 || playerTotal == 9 && dealerTotal == 10 || playerTotal == 9 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }
        //9 - 3,4,5,6 - DOUBLE DOWN
        else if (playerTotal == 9 && dealerTotal == 3 || playerTotal == 9 && dealerTotal == 4 || playerTotal == 9 && dealerTotal == 5 || playerTotal == 9 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";
        }
        //10 - 10,11 - HIT
        else if (playerTotal == 10 && dealerTotal == 10 || playerTotal == 10 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }
        //10 - 2,3,4,5,6,7,8,9 - DOUBLE DOWN
        else if (playerTotal == 10 && dealerTotal == 2 || playerTotal == 10 && dealerTotal == 3 || playerTotal == 10 && dealerTotal == 4 || playerTotal == 10 && dealerTotal == 5 || playerTotal == 10 && dealerTotal == 6 || playerTotal == 10 && dealerTotal == 7 || playerTotal == 10 && dealerTotal == 8 || playerTotal == 10 && dealerTotal == 9) {
            playerFeedback.innerHTML = "You stood<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";

        }
        //11 - everything - Double
        else if (playerTotal == 11 && dealerTotal == 2 || playerTotal == 11 && dealerTotal == 3 || playerTotal == 11 && dealerTotal == 4 || playerTotal == 11 && dealerTotal == 5 || playerTotal == 11 && dealerTotal == 6 || playerTotal == 11 && dealerTotal == 7 || playerTotal == 11 && dealerTotal == 8 || playerTotal == 11 && dealerTotal == 9 || playerTotal == 11 && dealerTotal == 10 || playerTotal == 11 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You stood<br> Correct choice: Double Down"
            playerFeedbackBackground.style.background = "red";
        }
        //12 - 2,3,7,8,9,10,11 = hit
        else if (playerTotal == 12 && dealerTotal == 2 || playerTotal == 12 && dealerTotal == 3 || playerTotal == 12 && dealerTotal == 7 || playerTotal == 12 && dealerTotal == 8 || playerTotal == 12 && dealerTotal == 9 || playerTotal == 12 && dealerTotal == 10 || playerTotal == 12 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: hit"
            playerFeedbackBackground.style.background = "red";
        }
        //12 - 4,5,6 - stand - stand
        else if (playerTotal == 12 && dealerTotal == 4 || playerTotal == 12 && dealerTotal == 5 || playerTotal == 12 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }

        //13 - 2,3,4,5,6 - STAND
        else if (playerTotal == 13 && dealerTotal == 2 || playerTotal == 13 && dealerTotal == 3 || playerTotal == 13 && dealerTotal == 4 || playerTotal == 13 && dealerTotal == 5 || playerTotal == 13 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }
        //13 - 7,8,9,10,11 - hit
        else if (playerTotal == 13 && dealerTotal == 7 || playerTotal == 13 && dealerTotal == 8 || playerTotal == 13 && dealerTotal == 9 || playerTotal == 13 && dealerTotal == 10 || playerTotal == 13 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }

        //14 - 2,3,4,5,6 - STAND
        else if (playerTotal == 14 && dealerTotal == 2 || playerTotal == 14 && dealerTotal == 3 || playerTotal == 14 && dealerTotal == 4 || playerTotal == 14 && dealerTotal == 5 || playerTotal == 14 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }
        //14 - 7,8,9,19,11 - hit
        else if (playerTotal == 14 && dealerTotal == 7 || playerTotal == 14 && dealerTotal == 8 || playerTotal == 14 && dealerTotal == 9 || playerTotal == 14 && dealerTotal == 10 || playerTotal == 14 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }

        //15 - 2,3,4,5,6 - STAND
        else if (playerTotal == 15 && dealerTotal == 2 || playerTotal == 15 && dealerTotal == 3 || playerTotal == 15 && dealerTotal == 4 || playerTotal == 15 && dealerTotal == 5 || playerTotal == 15 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }
        //15 - 7,8,9,10,11 - hit
        else if (playerTotal == 15 && dealerTotal == 7 || playerTotal == 15 && dealerTotal == 8 || playerTotal == 15 && dealerTotal == 9 || playerTotal == 15 && dealerTotal == 10 || playerTotal == 15 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }
        //16 - 2,3,4,5,6 - STAND
        else if (playerTotal == 16 && dealerTotal == 2 || playerTotal == 16 && dealerTotal == 3 || playerTotal == 16 && dealerTotal == 4 || playerTotal == 16 && dealerTotal == 5 || playerTotal == 16 && dealerTotal == 6) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }
        //16 - 7,8,9,10,11 - hit
        else if (playerTotal == 16 && dealerTotal == 7 || playerTotal == 16 && dealerTotal == 8 || playerTotal == 16 && dealerTotal == 9 || playerTotal == 16 && dealerTotal == 10 || playerTotal == 16 && dealerTotal == 11) {
            playerFeedback.innerHTML = "You Stood <br> Correct choice: Hit"
            playerFeedbackBackground.style.background = "red";
        }
        //17 - stand everything 
        else if (playerTotal >= 17 && dealerTotal >= 2) {
            playerFeedback.innerHTML = "You Stood<br> Correct choice: Stand"
            playerFeedbackBackground.style.background = "green";
        }

    }




}

function trueCountUpdate() {
    let trueCount = document.getElementById("trueCount");
    let cardsLeft = Math.round(gameShoe.length / 52);
    let trueCountValue = Math.round(runningCount / cardsLeft);
    trueCount.innerHTML = trueCountValue;
}

