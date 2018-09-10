/************************************** Utilties *************************************/
window.isJQuery = function(mySubject) { return mySubject instanceof jQuery; }

window.isDOMElement = function(mySubject) {
	try {//Using W3 DOM2 (works for FF, Opera and Chrome)
		return mySubject instanceof HTMLElement;
	} catch(e) {//Browsers not supporting W3 DOM2.
		return (typeof mySubject === "object") && (mySubject.nodeType === 1) && (typeof mySubject.style === "object") && (typeof mySubject.ownerDocument === "object");
	}
}

window.isValueElement = function(mySubject) {
	if (mySubject instanceof HTMLElement) mySubject = $(mySubject);
	if (mySubject.is('input') || mySubject.is('select') || mySubject.is('textarea')) {
		return true;
	} else { return false; }
}

window.isFunction = function(mySubject) { return mySubject && typeof(mySubject) === "function"; }

window.isNotNull = function(mySubject) { return (typeof mySubject === "object" && mySubject != null); }
/*************************************************************************************/
/************************************** Entities *************************************/
/** DECK *****************************************************************************/
class Deck {
	//Verb(s)
	get SHUFFLE() { return "shuffle stack"; }
	get RECEIVE() { return "receive card"; }

	//properties
	get stack() { return this._stack; }

	//Functions
	riffle(myStack, myIteration) {
		/**
			DESC: This recursive function simulates the riffle shuffle technique
			myStack: Deck.stack to be riffled
			myIteration: Int determining number of shuffles (recursions)
		**/

		//Split the stack
		var myNewStack = [];
		var myCut = Math.ceil(13 + Math.random()*26);//Either side of the cut will be > 13 AND < 39
		var myLeftHand = myStack.slice(0, myCut);
		var myRightHand = myStack.slice(myCut - 1);
		
		//Dovetail the stacks
		while (myLeftHand.length || myRightHand.length) {
			var myDovetail = Math.random();
			if (myDovetail < .5) {//Place left hand last card on top of stack; default right hand last card
				if (myLeftHand.length) myNewStack.unshift(myLeftHand.pop());
				else myNewStack.unshift(myRightHand.pop());
			} else {//Place right hand last card on top of stack; default left hand last card
				if (myRightHand.length) myNewStack.unshift(myRightHand.pop());
				else myNewStack.unshift(myLeftHand.pop());
			}
		}

		if (myIteration > 0) {//Reshuffle (recursion)
			myIteration--;
			return this.riffle(myNewStack, myIteration);
		} else {//Shuffle result
			return myStack;
		}
	}

	//Event handler
	lexicon(myVerb, myInvocation) {
		switch (myVerb) {
			case this.SHUFFLE:
				//Create unshuffled stack
				this._stack = [];
				for (var s = 0, sL = Card.SUIT.length; s < sL; s++) {
					for (var r = 0, rL = Card.RANK.length; r < rL; r++) {
						Mercury.invoke(Vulcan.FORGE, Card.RANK[r]+Card.SUIT[s]);
					}
				}
				//Riffle 4 times
				this._stack = this.riffle(this._stack, 4);
				Mercury.invoke(Dealer.DEAL, this);
			break;
			case this.RECEIVE:
				this._stack.push(myInvocation);
			break;
		}
	}

	constructor() {
		Mercury.listen(this.SHUFFLE, this);
		Mercury.listen(this.RECEIVE, this);
	}
}
/*************************************************************************************/
/** DEALER ***************************************************************************/
class Dealer {//Singleton
	//Verb(s)
	static get DEAL() { return "deal request"; }

	//Event handler
	lexicon(myVerb, myInvocation) {
		switch (myVerb) {
			case Dealer.DEAL:
				if (!myInvocation) {//Shuffle the deck if myInvocation is null
					Mercury.invoke(this.deck.SHUFFLE);
				} else if (thePlayerHand.is(myInvocation)) {//Deal a replacement card from the top
					Mercury.invoke(Poker.REQUEST, this.deck.stack.shift());
				} else {//Deal an entirely new hand
					var myCard;

					for (var c = 0, cL = 5; c < cL; c++) {
						myCard = this.deck.stack.shift();
						Mercury.invoke(Poker.REQUEST, myCard);
					}
				}
			break;
		}
	}

	constructor() {
		if (window.Dealer) {//Singleton exception
			throw "Dealer is already active.";
		} else {//Initialize
			this.deck = new Deck();
			Mercury.log("Dealer is ready...");
		}
	}
}
window.theDealer = new Dealer();
/*************************************************************************************/