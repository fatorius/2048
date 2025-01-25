import "./style.css";

import { getNRandomUniqueNumbers, getRandomFromArrayWithWeights } from "./random";

//=======================================================================

const NUMBER_OF_CELLS = 16;
const NUMBER_OF_ROWS_AND_COLUMNS = parseInt(Math.sqrt(NUMBER_OF_CELLS));

const NEW_TILES_VALUES = [2, 4];
const NEW_TILES_WEIGHTS = [0.75, 0.25];

//=======================================================================

const cells = [];
const tile_values = [];

function initGrid(){
	const grid = document.getElementById("grid");
	grid.style.gridTemplateRows = `repeat(${NUMBER_OF_ROWS_AND_COLUMNS}, 1fr)`;
	grid.style.gridTemplateColumns = `repeat(${NUMBER_OF_ROWS_AND_COLUMNS}, 1fr)`;

	for (let i = 0; i < NUMBER_OF_CELLS; i++){

		const cell = document.createElement("div");

		cell.setAttribute("class", "cell");
		grid.appendChild(cell);
		cells.push(cell);
		tile_values.push(0);
	}
}

function createTileElement(value){
	const tile = document.createElement("div");
	tile.classList.add("tile");
	tile.classList.add(`tile-${value}`);
	tile.innerText = value;

	return tile;
}

function initTiles(){
	const choosenCells = getNRandomUniqueNumbers(2, NUMBER_OF_CELLS - 1);

	choosenCells.forEach((cellNumber) => {
		const tileValue = getRandomFromArrayWithWeights(NEW_TILES_VALUES, NEW_TILES_WEIGHTS);

		cells[cellNumber].append(createTileElement(tileValue));
		tile_values[cellNumber] = tileValue;
	})
}

function findLeftmostAvailableTile(pos, value){
	const tilesToTheLeft = pos % NUMBER_OF_ROWS_AND_COLUMNS;

	for (let i = 1; i < tilesToTheLeft; i++){
		const checkingPos = pos - i;

		if (tile_values[checkingPos] !== 0){
			if (tile_values[checkingPos] === value){
				return checkingPos;
			}

			return pos;
		}

		pos = checkingPos;
	}

	return pos;
}

function moveTileTo(start, destination){
	if (start === destination){
		return;
	}

	const value = tile_values[start];
	const destination_value = tile_values[destination];

	let newValue = value;

	if (destination_value === value){
		newValue = parseInt(value * 2);
	}

	tile_values[start] = 0;
	tile_values[destination] = newValue;

	cells[start].innerHTML = "";
	cells[destination].appendChild(createTileElement(newValue));
}

function moveLeft(){
	for (let pos = 0; pos < NUMBER_OF_CELLS; pos++){
		if (tile_values[pos] === 0){
			continue;
		}

		const destination = findLeftmostAvailableTile(pos, tile_values[pos]);

		console.log(tile_values)
		moveTileTo(pos, destination)

		console.log(tile_values)
	}
}

function initEvents(){
	document.addEventListener("keydown", (e) => {
		const keyCode = e.keyCode;

		if (keyCode === 37){
			moveLeft();
		}
		else if (keyCode === 38){
			console.log("up")
		}
		else if (keyCode === 39){
			console.log("right")
		}
		else if (keyCode === 40){
			console.log("down")
		}
	});
}


function main(){
	initGrid();
	initTiles();
	initEvents();
}


main();