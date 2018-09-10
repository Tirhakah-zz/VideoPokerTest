/** Jupiter **************************************************************************/
/* This is king, as it orchestrates the actions of all other entities by calling on **/
/* and listening to the entity verbs and their invocations via Mercury. **************/
/*************************************************************************************/
//Verbs
var INITIALIZE = "poker initialize";
var REQUEST = "poker request";

//Globals
window.Poker = this;

//Inherents
var theGameboard = $('#gameboard');
var theScoreboard = theGameboard.find('#scoreboard');
var theDealButton = theGameboard.find('#deal.button');
var thePlayerHand = theGameboard.find('#player-hand');

//Functions
function lexicon(myVerb, myInvocation) {
	switch (myVerb) {
		case INITIALIZE:
			Mercury.invoke(Minerva.INSPIRE, theDealButton);
			theDealButton.find('.new-card.title').hide();
			theGameboard.show();
		break;
		case REQUEST:
			if (isJQuery(myInvocation)) {
				if (myInvocation.is(theDealButton)) {
					//Request new deal
					if (theDealButton.find('.new-game.title').is(':visible')) {
						//Deal a new game...
						theDealButton.find('.new-game.title').hide();
						theDealButton.find('.new-card.title').show();
						thePlayerHand.find('.card-slot').remove();//Clear cards from previous game (if any)
						theScoreboard.html("Welcome to Video Poker!");
						Mercury.invoke(Dealer.DEAL);
					} else {
						//Request replacement cards
						thePlayerHand.find('.card.discarded').each(function() {
							thePlayerHand.find('.card-slot').has(this).remove();
							Mercury.invoke(Dealer.DEAL, thePlayerHand);
						});
						
						/**** Tally score ****/
						var myPair = false;
						var myCard;
						var myRank;
						//Determine pair
						thePlayerHand.find('.card').each(function() {
							myCard = $(this);
							myRank = myCard.find('.rank').first().text();
							if (thePlayerHand.find('.card').has('.rank:contains("'+myRank+'")').not(myCard).length) {
								myPair = true;
							}
						});
						//Determine straight
						var myStraight = false;
						var mySequenceCount = 0;
						var mySortedRank = [];
						var myRankMark = null;
						thePlayerHand.find('.card .rank.SE').each(function() {
							mySortedRank.push(Card.RANK.indexOf($(this).text()));
						});
						mySortedRank.sort(function(a, b) { return a - b; });
						
						$.each(mySortedRank, function(i, val) {
							if (myRankMark == null) { mySequenceCount = 1; }
							if (val === myRankMark + 1) { mySequenceCount++; }
							myRankMark = val;
						});
						//Show results on theScoreboard
						if (mySequenceCount >= 5) {//STRAIGHT WIN!
							theScoreboard.html("A Straight!</br>You've won 500 points!</br>Play again.");
						} else if (myPair) {
							theScoreboard.html("A Pair!</br>You've won 100 points!</br>Play again.");
						} else {
							theScoreboard.html("You've lost.</br>Give it another try.");
						}
						/********************/
						//Reset theDealButton
						theDealButton.find('.new-game.title').show();
						theDealButton.find('.new-card.title').hide();
					}
				} else if (myInvocation.is('.card .toggle.button')) {
					var myCard = $('.card').has(myInvocation);
					if (!myCard.is('.discarded')) myCard.addClass('discarded');
					else myCard.removeClass('discarded');
				}
			} else if (myInvocation instanceof Card) {
				//Add Card to hand
				thePlayerHand.append($('#template .card-slot').clone().append(myInvocation.model));
			}
		break;
	}
}

$(document).ready(function(e) {
	Mercury.log("document ready");
	//Define Verbs
	Mercury.listen(Dealer.DEAL, theDealer);
	Mercury.listen(INITIALIZE, Poker);
	Mercury.listen(REQUEST, Poker);
	//Start the game
	Mercury.invoke(Poker.INITIALIZE);
});

$(window).on("load", function(e) {
	console.log("Window loaded");
});