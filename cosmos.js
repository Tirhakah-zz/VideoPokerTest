/* This is a stripped version of a custom framework that I've used on numerous *******/
/* projects. Each of the entities exclusively handle a core functionality initiated  */
/* by "verbs".                                                                       */
/************************************** Entities *************************************/
/** MERCURY **************************************************************************/
/* The only entity accessed directly, this dispatches the verbs between all entities */
/* and logs their activity.                                                          */
/*************************************************************************************/
window.Hermetica = {//Global data repository
	action: [],//Tracks interval actions
};
class Hermes {
	//Constants
	static get HERMETIC_SEAL() { return "sealed"; }
	static get HERMETIC_LEAK() { return "leaked"; }
	static get LOG_ENTRY_PREFIX() { return "l:"; }
	static get DILIGENCE() { return 100; }

	//Properties
	get chronos() { return this._chronos; }

	//Functions
	log() {
		if (typeof Mercury != 'undefined') {
			//Log event into Hermetica
			Hermetica[Mercury.LOG_ENTRY_PREFIX+Mercury.chronos.getTime()] = Array.from(arguments);
			//Broadcast log record if set to HERMETIC_LEAK
			if (Mercury._broadcast === Hermes.HERMETIC_LEAK) {
				console.log.apply(this, arguments);
			}
		} else { console.log.apply(this, arguments); }//Show all _broadcasts made before Mercury singleton instantiation
	}

	seal() { Mercury._broadcast = Hermes.HERMETIC_SEAL; }

	leak() { Mercury._broadcast = Hermes.HERMETIC_LEAK; }


	listen(myVerb, myActor) {
		if (typeof Hermetica[myVerb] !== "array") {
			Hermetica[myVerb] = [myActor];
		} else { Hermetica[myVerb].push(myActor); }

		this.log("Mercury listening to", myActor, myVerb);
	}

	ignore(myActor, myVerb) {
		if (myVerb) {//Remove specific actor verb
			for(var a = 0, aL = Hermetica[myVerb].length; a < aL; a++) {
				if (Hermetica[myVerb][a] == myActor) Hermetica[myVerb].splice(a);
			}
		} else {//Remove all actor verbs
			for(var verb in Hermetica[myVerb]) {
				for(var a = 0, aL = Hermetica[verb].length; a < aL; a++) {
					if (Hermetica[myVerb][a] == myActor) Hermetica[myVerb].splice(a);
				}
			}
		}
	}

	invoke(myVerb, myInvocation) {
		var myActor = Hermetica[myVerb];
		var myLogOutput = (["INVOKE"]).concat(Array.from(arguments));

		Mercury.log.apply(this, myLogOutput);

		if (!myActor) {
			Mercury.log("I, Mercury, ignore \""+myVerb+"\"!");
		} else {
			for (var a = 0, aL = myActor.length; a < aL; a++) {
				if (!myActor[a].lexicon) {
					Mercury.log("You, "+myActor[a]+", are illiterate!");
				} else {
					myActor[a].lexicon.apply(myActor[a], arguments);
				}
			}
		}
	}

	//Event handler
	lexicon(myVerb, myInvocation) {
		switch (myVerb) {
			case Mercury.ERASE:
				delete Hermetica[myInvocation];
			break;
			case Mercury.EXECUTE:
				var myAct = new Act(myInvocation);

				Hermetica.action.push(myAct);
			break;
			case Mercury.TERMINATE:
				var myIndex = Hermetica.action.indexOf(myInvocation);

				if (myIndex >= 0) {
					Hermetica.action.splice(myIndex, 1);
				}
			break;
		}
	}

	constructor() {
		if (window.Mercury) {//Singleton exception
			throw "Mercury already exists.";
		} else {
			//Inherents
			this._chronos = new Date();
			this._taskmaster = setInterval(this.compel, Hermes.DILIGENCE);
			this._broadcast = Hermes.HERMETIC_LEAK;//Verbose debug output
			this.log("Mercury is ready...");
		}
	}
}
window.Mercury = new Hermes();
/*************************************************************************************/
/** VULCAN ***************************************************************************/
/* The builder of all elements that will enter the window. ***************************/
/*************************************************************************************/
class Hephaestus {//Singleton
	//Verbs
	get FORGE() { return "forge"; }

	//Event handler
	lexicon(myVerb, myInvocation) {
		switch (myVerb) {
			case Vulcan.FORGE:
				var myForgery;
				var mySuit = myInvocation.substr(myInvocation.indexOf("&"));

				//Cards
				if (Card.SUIT.indexOf(mySuit) > -1) {
					myForgery = new Card(myInvocation);
					Mercury.invoke(Minerva.INSPIRE, myForgery.model.find('.button'));//Call Minerva to provide element logic
					Mercury.invoke(theDealer.deck.RECEIVE, myForgery);
				}

				myForgery = null;
			break;
		}
	}

	constructor() {
		if (window.Vulcan) {//Singleton exception
			throw "Vulcan already exists.";
		} else {
			Mercury.listen(this.FORGE, this);
			Mercury.listen(this.IMPLEMENT, this);
		}
	}
}
window.Vulcan = new Hephaestus();
/*************************************************************************************/
/** MINERVA **************************************************************************/
/* She "inspires" all the elements with their defaul logic. For example: *************/
/* A button's default click actions or an input field's default blur actions; ********/
/* however, the specific navigation from that button action or the input validation **/
/* will be left to Jupiter (i.e. Poker.js) to handle once he's witnessed the verbs. **/
/*************************************************************************************/
class Athena {//Singleton
	//Verbs
	get INSPIRE() { return "impart logic"; }
	get BUTTON_CLICK() { return "button clicked"; }

	//Functions
	determine(myInvocation) {
		var myComponent;

		//Button
		if (myInvocation.hasClass('button')) {
			myInvocation.each(function() {
				$(this).on('click', function() {
					Mercury.invoke(Minerva.BUTTON_CLICK, this);
				});
			});
		}
	}

	lexicon(myVerb, myInvocation) {
		switch (myVerb) {
			case Minerva.INSPIRE:
				this.determine(myInvocation);
			break;
			case Minerva.BUTTON_CLICK:
				var myActor = $(myInvocation);

				//Default Button actions HERE

				Mercury.invoke(Poker.REQUEST, myActor);
			break;
		}
	}

	constructor() {
		if (window.Minerva) {//Singleton exception
			throw "Minerva already exists.";
		} else {
			Mercury.listen(this.INSPIRE, this);
			Mercury.listen(this.BUTTON_CLICK, this);
		}
	}
}
window.Minerva = new Athena();
/*************************************************************************************/