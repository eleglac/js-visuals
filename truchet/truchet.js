window.addEventListener("click", clickHandler);

var sources = ["url(\"truchet-tl-br.svg\")", "url(\"truchet-tr-bl.svg\")"];
var tileScale = 5;
var columns = Math.floor(100/tileScale);
var rows = Math.floor(75/tileScale);
var tiles = columns*rows;

var flipChance = 0.05;
var flipFlag = true;

function flipTile(tile) {
	var source = tile.style.backgroundImage;
	tile.className += " animating";

	if (source == sources[0]) {
		setTimeout(function(){tile.style.backgroundImage = sources[1]; tile.className = "truchet";}, 1000);
	}
	else {
		setTimeout(function(){tile.style.backgroundImage = sources[0]; tile.className = "truchet";}, 1000);
	}
}

function randomizeTiles() {
	for (i = 0; i < tiles; i++) {
		if (Math.random() < flipChance) {
			flipTile(document.getElementById(i));
		}
	}
}

function createTile(id) {
	var tile = document.createElement("DIV");
	tile.className = "truchet";
	tile.id = id;
	tile.style.backgroundImage = "url('truchet-tl-br.svg')";
	tile.addEventListener("mouseover", function(){flipTile(this);});
	
	return tile;
}

function clickHandler() {
	if (flipFlag) {
		flipFlag = false;
		loopTileFlipping();
	}
}

function loopTileFlipping() {
	randomizeTiles();
	setTimeout(loopTileFlipping, 2000);
}

for (i = 0; i < tiles; i++) {
	document.body.appendChild(createTile(i));
}