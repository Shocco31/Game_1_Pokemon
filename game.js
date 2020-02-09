// our javascript code

/****************************************************
 *** Variables ***
 ****************************************************/

// important HTML blocks
// related to the UI
let main_container = document.querySelector("#game");
let game_title = document.querySelector("#game_title");
let start_button = document.querySelector("#start_button");
let game_over = document.querySelector("#game_over");

// related to the game
let player = document.querySelector("#player");
let ground = document.querySelector("#ground");
let enemies = document.querySelector("#enemies");

// parameters
// minimal margin to the bottom (in pixels)
let marginBottom = 100;
// plane jump speed (in seconds)
let jumpSpeed = 0.5;
// how much height is a jump (in pixels)
let jumpStep = 100;
// how long is a fall (in seconds)
let fallSpeed = 2;
// how much time after a jump do we fall (in milliseconds)
let timeToFallAfterJump = 400;
// delay between two enemies motion (in milliseconds)
let motionDelay = 15;
// motion distance at each step (in pixels)
let motionStep = 4;
// other variables
let spawn, motion, playerGravity;

// sound
let musicGame;
musicGame = new Audio("sound/pokemon-theme.mp3");

/****************************************************
 *** When game starts ***
 ****************************************************/
// start the sound
musicGame.play();
musicGame.volume = 0.05;
musicGame.loop = true;

// hide some UI components
game_over.style.display = "none";

// hide some game components
player.style.display = "none";
enemies.style.display = "none";

// Start game
function startGame() {

	// hide some UI components
	game_title.style.display = "none";
	game_over.style.display = "none";

	// display some game components
	player.style.display = "block";
	enemies.style.display = "block";

	// enemy motion
	motion = setInterval(function() {
		document.querySelectorAll("#enemies > .pokeball, #enemies > .hyperball").forEach(function(div) {
			move(div);
		});
	}, motionDelay);

	document.addEventListener('keydown', event => {
		if (event.keyCode == 32){
			jump();
			return;
		}
	})

	// player gravity
	// make the player fall
	// change the player bottom margin
	// 'px' is the unit (=pixels)
	// thanks to the CSS 'transition' rule,
	// the fall is progressive
	player.style.bottom = marginBottom + "px";

	// invoke an enemy
	spawnEnemy();
	intervalID = window.setInterval(spawnEnemy, 1000);

	// toggle start button visibility to off
	start_button.style.display = "none";

	// remove all enemies
	let elements = document.getElementsByClassName("pokeball");
	if (elements.length != 0) {
		while (elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
		}
	}
	let elements2 = document.getElementsByClassName("hyperball");
	if (elements2.length != 0) {
		while (elements2.length > 0){
			elements2[0].parentNode.removeChild(elements2[0]);
		}
	}

	let elements_ponyta = document.getElementsByClassName("ponyta");
	if (elements_ponyta.length != 0) {
		while (elements_ponyta.length > 0){
			elements_ponyta[0].parentNode.removeChild(elements_ponyta[0]);
		}
	}
}

/****************************************************
 *** Functions ***
 ****************************************************/

// make the player jump
function jump() {

	// if we are on the top, don't jump anymore
	if (player.offsetTop < 50) return;

	// set the jump duration
	// as we use the CSS animation
	player.style.transition = jumpSpeed + "s";
	// the CSS animation is described in the 'fallingPlayer' class
	player.classList.remove("fallingPlayer");

	// if we jump, we stop the gravity fall
	clearInterval(playerGravity);

	// and then update the player position
	let offsetBottom =
		main_container.offsetHeight - (player.offsetTop + player.offsetHeight);
	player.style.bottom = offsetBottom + jumpStep + "px";

	// after we have jumped, we fall again (gravity)
	setGravity();
}

// make the player fall after a jump
function setGravity() {
	playerGravity = setTimeout(function() {
		player.style.transition = fallSpeed + "s";
		player.style.bottom = marginBottom + "px";
	}, timeToFallAfterJump);
}

function getPosition(div) {
	let left = div.offsetLeft;
	let top = div.offsetTop;
	let right = div.offsetLeft + div.offsetWidth;
	let bottom = div.offsetTop + div.offsetHeight;

	// the '10' here is to allow some tolerance in the collision
	return [left + 10, right - 10, top + 10, bottom - 10];
}

// check if there is a collision between two blocks
function isCollision(bloc1, bloc2) {
	return !(
		bloc1[1] < bloc2[0] ||
		bloc1[0] > bloc2[1] ||
		bloc1[3] < bloc2[2] ||
		bloc1[2] > bloc2[3]
	);
}

// Get random number
function random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; 
}

// spawn a new enemy HTML block

function spawnEnemy() {
	let newObstacle = document.createElement("div");
	let enemiesType = random(0,21);
  
	if (enemiesType == 20) {
	  newObstacle.classList.add("pokeball");
	  newObstacle.style.bottom = random(100, 600) + "px";
	  enemies.appendChild(newObstacle);
	} else {
	newObstacle.classList.add("hyperball");
	newObstacle.style.bottom = random(100, 600) + "px";
	enemies.appendChild(newObstacle);
	}
	
  }
  

// move an enemy
// this function is called for each enemy step
// see the setInterval above
function move(div) {
	div.style.left = div.offsetLeft - motionStep + "px";

	if (div.offsetLeft <= 0) div.remove();

	posPlayer = getPosition(player);
	posObs = getPosition(div);

	if (isCollision(posPlayer, posObs)) {
		stopGame();
	}
}

// stops the game
function stopGame() {

	// Stop music
	musicGame.pause();

	
	// hide the player
	player.style.display = "none";

	// stop the enemies motion
	clearInterval(motion);

	// stop to spawn new enemies and hide
	clearTimeout(spawn);
	enemies.style.display = "none";
	while (enemies.firstChild) {
		enemies.removeChild(enemies.firstChild);
	}

	// game over
	game_over.style.display = "flex";

	// show restart button
	start_button.style.display = "block";
	start_button.textContent = "Restart";
}
