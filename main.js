document.addEventListener("DOMContentLoaded", () => { playGame(); });

function playGame() {
    /* array containing arrays of the letters guessed so far.*/
    let guessedLetters = [[], [], [], [], [], []];

    /* The index (0-29) of the current/next square to be filled */
    let indexOfSquareToFill = 0;

    /* The number of fully guessed words so far. */
    let guessedWordCount = 0;

    /* The html elements for all the keyboard keys. */
    const keys = document.querySelectorAll(".keyboard-row button");

    let mostRecentGuess = "";

	
	let gameOver = false;
	let keysEnabled = false;

	let letters = "abcdefghijklmnopqrstuvwxyz";

	let wordIndex = "";

	let gameState = 0;

	let username = "";


	async function login(username, password) {
		console.log("Username:", username);
		console.log("Password:", password);
		let myResponse = await fetch("main.php?username=" + username + "&password=" + password + "&login");
		let result = await myResponse.json();
		console.log(result);
		if (result !== "Incorrect username or password.") {
			document.getElementById('login').style.visibility = "hidden";
			document.getElementById('errorMessage').style.visibility = "hidden";
			keysEnabled = true;
			username = result["loginID"];
			newGameState(username);
			return;
		} else {
			document.getElementById('errorMessage').style.visibility = "visible";
			document.getElementById('errorMessage').innerHTML = 'Incorrect username or password.';

		}
	}


	async function createPlayer(username, password) {
		console.log("Username:", username);
		console.log("Password:", password);
		let myResponse = await fetch("main.php?username=" + username + "&password=" + password +"&create");
		let result = await myResponse.json();
		console.log(result);
		if (result === "success") {
			document.getElementById('login').style.visibility = "hidden";
			document.getElementById('errorMessage').style.visibility = "hidden";
			keysEnabled = true;
			newGameState(username);
			return;
		} else {
			document.getElementById('errorMessage').style.visibility = "visible";
			document.getElementById('errorMessage').innerHTML = 'Player already exists.';

		}

	}

	async function newGameState(username) {
		wordIndex = String(getWordIndex(8938));
		console.log(wordIndex);
		let myResponse = await fetch("main.php?index=" + wordIndex + "&username=" + username + "&new");
		let result = await myResponse.json();
		if (result === "true") {
			console.log(username);
			newGameState(username);

		}
		gameState = result;
		console.log("gamestate:", gameState);

	}


	
    function getCurrentWordArray() {
		document.getElementById('gameMessage').style.visibility = "hidden";
		document.getElementById('gameMessage').style.backgroundColor = "transparent";
		return guessedLetters[guessedWordCount];
    }

	function getWordIndex(num) {
		return Math.floor(Math.random() * num);
	}
	console.log(wordIndex);

		

    function updateGuessedLetters(letter) {
		if (gameOver === false && letter !== "New") {
			const currentWordArray = getCurrentWordArray();
			if (currentWordArray.length < 5) {
				currentWordArray.push(letter);
				const currentSquareElement = document.getElementById(String(indexOfSquareToFill));
				currentSquareElement.textContent = letter;
				indexOfSquareToFill += 1;
			}
		}
		if (letter === "New") {
			keysEnabled = false;
			handleOverlayMessage()
		}
    }

	function handleOverlayMessage() {
		document.getElementById("areYouSure").style.display = "block";
		document.getElementById("sureYes").onclick = () => {
			document.getElementById("areYouSure").style.display = "";
			keysEnabled = true;
			handleNewWord();
		}
			document.getElementById("sureNo").onclick = () => {
			document.getElementById("areYouSure").style.display = "";
			keysEnabled = true;
		}
	}

	function handleNewWord() {
		console.log("New word");
		newGameState()
		guessedWordCount = 0;
		guessedLetters = [[], [], [], [], [], []];
		mostRecentGuess = "";
		console.log(wordIndex);
		indexOfSquareToFill = 0;
		for (let i=0; i<30; i++ ) {
			let currentSquare = document.getElementById(String(i));
			currentSquare.textContent = " ";
			currentSquare.style.backgroundColor = "transparent";

		}
		for (let i=0; i<letters.length; i++ ) {
			let currentKeyElement = document.getElementById(String(letters[i]));
			currentKeyElement.style.backgroundColor = "rgb(199, 103, 39)";
		}
		document.getElementById('gameMessage').style.visibility = "hidden";
		gameOver = false;
		return;
	}

    function handleSubmitWord() {
		if (gameOver !== true) {
			const currentWordArray = getCurrentWordArray();
			mostRecentGuess = currentWordArray.join("");
			let realWord = true;
			async function determineRealWord(guess) {
				console.log("Player's guess: ", guess);
				let getURL = "main.php?next=" + gameState + "&guess=" + mostRecentGuess + "&index=" +wordIndex;
				console.log(getURL);
				let myResponse = await fetch(getURL);
				let result = await myResponse.json();
				gameState = result["gameState"];

				if (result["colors"] === "false") {
					realWord = false;
				} else {
					realWord = true;
				}
				if (gameOver === false) {
					if (currentWordArray.length !== 5) {
						document.getElementById('gameMessage').style.visibility = "visible";
						document.getElementById('gameMessage').style.color = "white";
						document.getElementById('gameMessage').style.backgroundColor = "rgb(199, 103, 39)"
						document.getElementById('gameMessage').innerHTML = `Enter 5 letters before submitting!`;
					} else if (realWord === false) {
						document.getElementById('gameMessage').style.visibility = "visible";
						document.getElementById('gameMessage').style.color = "white";
						document.getElementById('gameMessage').style.backgroundColor = "rgb(199, 103, 39)"
						document.getElementById('gameMessage').innerHTML = `You must enter a real word!`;
					} else {
						mostRecentGuess = currentWordArray.join("");
						//window.alert(`You guessed '${mostRecentGuess}'`);
						guessedWordCount += 1;
						determineGuessColors()
					} 
				} else {
					window.alert("Game Over!");
				}
			}
			determineRealWord(mostRecentGuess);
		}
    }

	document.getElementById("leaderboard-button").onclick = () => {
		if (keysEnabled == true) {
			console.log("opening leaderboard");
			document.getElementById('leaderboard').style.visibility = "visible";
			document.getElementById('leaderboard-button').style.visibility = "hidden";
			let sortedResult = [];
			async function getLeaderboardData() {
				let getURL = "main.php?leaderboard=" + "123";
				let myResponse = await fetch(getURL);
				let result = await myResponse.json();
				sortedResult = result.slice().sort(function (a, b) {

					// Sort by wins 
					// If the first item has a higher number, move it down
					// If the first item has a lower number, move it up
					if (a.gamesWon > b.gamesWon) return -1;
					if (a.gamesWon < b.gamesWon) return 1;
				
					// If the votes number is the same between both items, sort alphabetically
					// If the first item comes first in the alphabet, move it up
					// Otherwise move it down
					if (a.gamesPlayed > b.gamesPlayed) return 1;
					if (a.gamesPlayed < b.gamesPlayed) return -1;
				
				});
				console.log(sortedResult.length);


				for (let i = 0; i < sortedResult.length; i++) {
					document.getElementById('players').insertAdjacentHTML("beforebegin", '<p id="line-item">' + sortedResult[i].loginID + '</p>');
					document.getElementById('games-played').insertAdjacentHTML("beforebegin", '<p id="line-item">'+sortedResult[i].gamesPlayed+'</p>');
					document.getElementById('wins').insertAdjacentHTML("beforebegin", '<p id="line-item" style="color:#20fc03;">'+sortedResult[i].gamesWon+'</p>');
				}

			}
			getLeaderboardData();
			
			document.getElementById("exitLeaderbaordButton").onclick = () => {
				document.getElementById('leaderboard').style.visibility = "hidden";
				document.getElementById('leaderboard-button').style.visibility = "visible";
				for (let i = 0; i < sortedResult.length; i++) {
					document.getElementById('line-item').remove();
					document.getElementById('line-item').remove();
					document.getElementById('line-item').remove();
				}
			}

		}
		

	}
	
	document.getElementById("loginButton").onclick = () => {
		
		var username = document.getElementById("usernameInput").value;
		var password = document.getElementById('passwordInput').value;
		if (username == "" || password == "") {
			document.getElementById('errorMessage').style.visibility = "visible";
			document.getElementById('errorMessage').innerHTML = 'Please fill in all fields.';
			return;
		}
		return login(username, password);
	}

	document.getElementById("createButton").onclick = () => {
		var username = document.getElementById("usernameInput").value;
		var password = document.getElementById('passwordInput').value;
		if (username == "" || password == "") {
			document.getElementById('errorMessage').style.visibility = "visible";
			document.getElementById('errorMessage').innerHTML = 'Please fill in all fields.';
			return;
		}
		return createPlayer(username, password);
	}




	for (let i = 0; i < keys.length; i++) {
		keys[i].onclick = (event) => {
			if (keysEnabled == true) {
				const keyValue = event.target.textContent;
				if (keyValue === "Submit") {
					handleSubmitWord();
					return;
				}
				if (keyValue === "Del" && gameOver === false) {
					handleDelKey()
					return;
				}
				updateGuessedLetters(keyValue);
			}
			return;
		
		};
	}


	function determineGuessColors()  {
		let guessColors = ['gray', 'gray', 'gray', 'gray', 'gray'];
		let boxIndex = 0;

		if (guessedWordCount === 2) {
			boxIndex = 5;
		} else if (guessedWordCount === 3) {
			boxIndex = 10;
		} else if (guessedWordCount === 4) {
			boxIndex = 15;
		} else if (guessedWordCount === 5) {
			boxIndex = 20;
		} else if (guessedWordCount === 6) {
			boxIndex = 25;
		} 

	
		async function determineColorsInPHP(guess) {
			console.log("Player's guess: ", guess);
			console.log("gameState: ", gameState);
			let getURL = "main.php?next=" + gameState + "&guess=" + mostRecentGuess + "&index=" +wordIndex;
			console.log(getURL);
			let myResponse = await fetch(getURL);
			let result = await myResponse.json();
			guessColors = result["colors"];
			gameId = result["gameId"]
			console.log("word to guess = " + result["wordToGuess"]);
			checkIfWinner(guessColors, gameId);

			

			for (let i=0; i<5; i++ ){
				const currentSquareElement = document.getElementById(String(i + boxIndex));
				const currentLetter = guess[i];
				const currentKeyElement = document.getElementById(currentLetter);

				if (guessColors[i] === 'gray') {
					currentSquareElement.style.backgroundColor = "gray";
					currentKeyElement.style.backgroundColor = "gray";
				} else if (guessColors[i] === 'green') {
					currentSquareElement.style.backgroundColor = "green";
					currentKeyElement.style.backgroundColor = "green";
				} else {
					currentSquareElement.style.backgroundColor = "yellow";
					currentKeyElement.style.backgroundColor = "rgb(210, 210, 4)";
				}
			}
	
			console.log(guessColors);
			console.log(indexOfSquareToFill);
			if (guessColors.includes('gray') || guessColors.includes('yellow')) {
				gameOver = false;
				if (guessedWordCount === 6) {
					guessColors;
					document.getElementById('gameMessage').style.visibility = "visible";
					document.getElementById('gameMessage').style.color = "rgb(251, 255, 0)";
					document.getElementById('gameMessage').innerHTML = `The word is: `+result["wordToGuess"];
					gameOver = true
					return;
				}
				return guessColors;
			} else {
				document.getElementById('gameMessage').style.visibility = "visible";
				document.getElementById('gameMessage').style.color = "rgb(145, 255, 0)";
				document.getElementById('gameMessage').innerHTML = 'You win!';
				gameOver = true;
				return;
			}




		}
		determineColorsInPHP(mostRecentGuess);
	}

	async function checkIfWinner(guessColors, gameId){
		console.log("checking winner");
		console.log("wordIndex= ", wordIndex);
		let arr = guessColors;
		if (arr.filter(x => x === "green").length === 5) {
			let myResponse = await fetch("main.php?username=" + gameId + "&index=" + wordIndex +"&winner");
			let result = await myResponse.json();
			console.log(result);


		}

	}

	


	function handleDelKey() {
		const currentWordArray = getCurrentWordArray();
		if (currentWordArray.length !== 0) {
			currentWordArray.pop();
			indexOfSquareToFill -= 1;
			const currentSquareElement = document.getElementById(String(indexOfSquareToFill));
			currentSquareElement.textContent = "";
		}
		return;
	}


	document.addEventListener('keydown', (event) => {
		if (keysEnabled == true) {
			var name = event.key;
			if (name === 'Enter') {
				event.preventDefault();
				handleSubmitWord();
			} else if (name === "Backspace") {
				handleDelKey()
			} else if (letters.includes(name)) {
				updateGuessedLetters(name);
			}
		}
		}, false);
		
};
