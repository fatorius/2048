import "./style.css";

import { getNRandomUniqueNumbers, getRandomFromArray, getRandomFromArrayWithWeights } from "./random";

//=======================================================================

const NUMBER_OF_CELLS = 16;
const NUMBER_OF_ROWS_AND_COLUMNS = parseInt(Math.sqrt(NUMBER_OF_CELLS));

const NEW_TILES_VALUES = [2, 4];
const NEW_TILES_WEIGHTS = [0.75, 0.25];

//=======================================================================

const cells = [];
const tile_values = [];
var score = 0;


const scoreElement = document.getElementById("score");

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


function obterCelulasVazias() {
  return tile_values.reduce((indices, num, index) => {
    if (num === 0) {
      indices.push(index);
    }
    return indices;
  }, []);
}

function generateNewTile(){
	const newCell = getRandomFromArray(obterCelulasVazias());
	const tileValue = getRandomFromArrayWithWeights(NEW_TILES_VALUES, NEW_TILES_WEIGHTS);

	cells[newCell].append(createTileElement(tileValue));
	tile_values[newCell] = tileValue;

}

function updateScore(){
	let newScore = 0;

	tile_values.forEach((e) => {
		newScore += e;
	})

	scoreElement.innerHTML = newScore;
}

function findLeftmostAvailableTile(pos, value){
	const tilesToTheLeft = pos % NUMBER_OF_ROWS_AND_COLUMNS;

	for (let i = 1; i <= tilesToTheLeft; i++){
		const checkingPos = pos - 1;

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

function findTopmostAvailableTile(pos, value){
	const tilesUp = Math.floor(pos / NUMBER_OF_ROWS_AND_COLUMNS);

	for (let i = 1; i <= tilesUp; i++){
		const checkingPos = pos - NUMBER_OF_ROWS_AND_COLUMNS;

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

function findRightmostAvailableTile(pos, value){
	const tilesRight = (NUMBER_OF_ROWS_AND_COLUMNS - pos) - 1;

	for (let i = 1; i <= tilesRight; i++){
		const checkingPos = pos + 1;

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

function findBottommostAvailableTile(pos, value){
	const tilesUp = Math.floor(NUMBER_OF_CELLS - pos / NUMBER_OF_ROWS_AND_COLUMNS);

	for (let i = 1; i <= tilesUp; i++){
		const checkingPos = pos + NUMBER_OF_ROWS_AND_COLUMNS;

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
	cells[destination].innerHTML = "";
	cells[destination].appendChild(createTileElement(newValue));
}

function moveLeft(){
	let numberOfMoves = 0;

	for (let pos = 0; pos < NUMBER_OF_CELLS; pos++){
		if (tile_values[pos] === 0){
			continue;
		}

		const destination = findLeftmostAvailableTile(pos, tile_values[pos]);

		if (destination !== pos){
			moveTileTo(pos, destination);
			numberOfMoves++;
		}
	}

	if (numberOfMoves > 0){
		generateNewTile();
	}
}

function moveUp(){
	let numberOfMoves = 0;

	for (let pos = 0; pos < NUMBER_OF_CELLS; pos++){
		if (tile_values[pos] === 0){
			continue;
		}

		const destination = findTopmostAvailableTile(pos, tile_values[pos]);

		if (destination !== pos){
			moveTileTo(pos, destination);
			numberOfMoves++;
		}
	}

	if (numberOfMoves > 0){
		generateNewTile();
	}
}

function moveRight(){
	let numberOfMoves = 0;

	for (let pos = NUMBER_OF_CELLS-1; pos >= 0; pos--){
		if (tile_values[pos] === 0){
			continue;
		}

		const destination = findRightmostAvailableTile(pos, tile_values[pos]);

		if (destination !== pos){
			moveTileTo(pos, destination);
			numberOfMoves++;
		}
	}

	if (numberOfMoves > 0){
		generateNewTile();
	}
}

function moveDown(){
	let numberOfMoves = 0;

	for (let pos = NUMBER_OF_CELLS-1; pos >= 0; pos--){
		if (tile_values[pos] === 0){
			continue;
		}

		const destination = findBottommostAvailableTile(pos, tile_values[pos]);

		if (destination !== pos){
			moveTileTo(pos, destination);
			numberOfMoves++;
		}
	}

	if (numberOfMoves > 0){
		generateNewTile();

	}
}

function initEvents(){
	document.addEventListener("keydown", (e) => {
		const keyCode = e.keyCode;

		if (keyCode === 37){
			moveLeft();
		}
		else if (keyCode === 38){
			moveUp();
		}
		else if (keyCode === 39){
			moveRight();
		}
		else if (keyCode === 40){
			moveDown();
		}

		updateScore();
	});
}


function main(){
	initGrid();
	initTiles();
	initEvents();
	updateScore();
}


main();