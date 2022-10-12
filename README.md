# Wordle Web App

# Purpose

A recreation of the New York Times's Wordle game with a new UI and leaderboard. The app will generate a new five letter word each game and will not repeat words when they have been solved (user must be signed in).

Created using HTML/CSS, JavaScript, PHP, MySQL, SQLite Database

# Features
- Login and create an account to save your wins and games played
- Game will select a random, unplayed five letter word from all five letter words in the English language
- Leaderboard to compare your stats with all other players sorted by number of wins
- Once a word is solved you will never see that word again!
- Letters will change color based on the word guess on the board and keyboard
- Responsive to mobile devices

# How To Use
Test and view the website here: http://wordle-php.000webhostapp.com/

### Login
- Log in using a unique username and password or create an account to start 
<img src="https://user-images.githubusercontent.com/71997310/195445941-dd532ffe-23bd-4023-ac02-3fb4488893e1.png" width="700"/>

### Leaderboard
- Compare your game stats with other players
<img src="https://user-images.githubusercontent.com/71997310/195445985-48388d6d-03ee-468d-ab78-8bb0352779f4.png" width="700"/>

### Game
- Start by entering any five letter word (make it good, you only have 6 guesses!)
<img src="https://user-images.githubusercontent.com/71997310/195446038-9ddff0d7-3c00-47e9-ad80-cb013511a45e.png" width="700"/>

- The game will automatically tell you how close you are to the puzzle represented by the colored blocks
- - Green = correct letter in correct space
- - Yellow = correct letter in incorrect space (if you enter a letter twice and it appears only once in the word the second letter input will be gray)
- - Gray = letter is not in the word
<img src="https://user-images.githubusercontent.com/71997310/195446092-031b784b-0871-436c-88d2-781fd9ef0a97.png" width="700"/>

- After six incorrect guesses the solution will be revealed
<img src="https://user-images.githubusercontent.com/71997310/195446161-875b851b-8499-4f44-a66e-4173e166cafc.png" width="700"/>


