window.addEventListener("click", swapHandler);

var tileScale = 1;
var columns = Math.floor(100/tileScale);
var rows = Math.floor(75/tileScale);
var tiles = columns*rows;

var temperature = 0.05;

function createTile(id) {
	var tile = document.createElement("DIV");
	tile.className = "swapper";
	tile.id = id;
	if (columns/2 < id%columns) {
		tile.style.backgroundColor = "white";
	} 
	else {
		tile.style.backgroundColor = "black";
	}
	
	return tile;
}

function getNeighbors(tile) {
	var id = parseInt(tile.id);
	
	var top, bottom;
	if ((id - columns) < 0) {
		top = null;
		bottom = id + columns;
	} 
	else if ((id + columns) > tiles) {
		top = id - columns;
		bottom = null;
	} 
	else {
		top = id - columns;
		bottom = id + columns;
	}

	var left, right;
	if ((id - 1)%columns > id%columns) {
		left = null;
		right = id + 1;
	} 
	else if ((id + 1)%columns < id%columns) {
		left = id - 1;
		right = null;
	} 
	else {
		left = id - 1;
		right = id + 1;
	}

	return [top, left, bottom, bottom, right];
}

function swap(tile) {
	var neighbors = getNeighbors(tile);
	var randNeighbor = neighbors[Math.floor(Math.random()*neighbors.length)];
	var toSwap = document.getElementById(randNeighbor);

	if (toSwap) {		
		var tileStyle = tile.style.backgroundColor;
		var neighborStyle = toSwap.style.backgroundColor;

		if (tileStyle != neighborStyle) {
			tile.style.backgroundColor = neighborStyle;
			toSwap.style.backgroundColor = tileStyle;
		}
	}
}

function swapHandler() {
	for (i = 0; i < tiles; i++) {
		if (Math.random() < temperature) {
			swap(document.getElementById(i));
		}
	}
	setTimeout(swapHandler, 30);
}	

for (i = 0; i < tiles; i++) {
	document.body.appendChild(createTile(i));
}