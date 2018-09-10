/******************************** ENTITIES ********************************/
class Card {
	//Inherents
	get model() { return this._model; }

	//Constants
	static get SUIT() { return ["&spades;", "&clubs;", "&hearts;", "&diams;"]; }
	static get RANK() { return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; }

	constructor(myValue) {
		var myRank = myValue.substr(0, myValue.indexOf("&"));
		var mySuit = myValue.substr(myValue.indexOf("&"));

		this._model = $('#template .card').clone().addClass(mySuit.slice(1, mySuit.length - 1));
		this._model.find('.rank').text(myRank);
		this._model.find('.suit').html(mySuit);
	}
}
/**************************************************************************/