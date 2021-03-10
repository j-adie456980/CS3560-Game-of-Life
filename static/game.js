const gridSize = 500;
const numRowCells = 50;
const cellLength = (gridSize/numRowCells);

const drawGrid = (grid, contextIn) => {
  contextIn.clearRect(0, 0, gridSize, gridSize)
  contextIn.strokeStyle = "grey"; contextIn.fillStyle = "red"; //style cell drawing
  let cellState, xPos, yPos;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      xPos = (cellLength * i); yPos = (cellLength * j); //set positioning for drawing cells
      contextIn.strokeRect(xPos, yPos, cellLength, cellLength) //draw outline for a box
      cellState = grid[i][j];
      if (cellState) contextIn.fillRect(xPos, yPos, cellLength, cellLength) //fill cell if state is alive
    }
  }
}

const getEmptyGrid = () => {
  const grid = new Array(numRowCells) //create row
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(numRowCells);
    for (let j = 0; j < grid.length; j++) { grid[i][j] = false }  //initialize all elements of grid to empty boxes
  }
  return grid;
}


const drawingLetters = (grid) => {
  grid[25][25] = true;
  grid[26][26] = true;
  grid[24][27] = true;
  grid[25][27] = true;
  grid[26][27] = true;
  /*grid[46][45] = true;
  grid[47][46] = true;
  grid[45][47] = true;
  grid[46][47] = true;
  grid[47][47] = true;*/
  return grid;
} 

/*
const eraseGrid = (grid) => {
  for(let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      grid[i][j] = false;
    }
  }
  return grid;
} */

//Given a grid and a coordinate on that grid to check, will return a boolean value
//that states whether the cell should live or die off in the next generation
const determineNextGen = (grid, i, j) => {
    //console.log(`Cell ${i} | ${j} has with ${checkNeighbor(grid, i, j)} neighbors`);
    if (grid[i][j]) {//alive cell to start
      if (checkNeighbor(grid, i, j) == 2 || checkNeighbor(grid, i, j) == 3) //survives
          {//console.log(`Cell ${i} | ${j} survives with ${checkNeighbor(grid, i, j)} neighbors`)
          return true;}
      else  
          {//console.log(`Cell ${i} | ${j} died with ${checkNeighbor(grid, i, j)} neighbors`)
          return false;} //dies out
    }
    else {//dead cell to start
      if (checkNeighbor(grid, i, j) == 3) //cell is born
          {//console.log(`Cell ${i} | ${j} is born with ${checkNeighbor(grid, i, j)} neighbors`)
          return true;}
      else 
          {//console.log(`Cell ${i} | ${j} remains unborn with ${checkNeighbor(grid, i, j)} neighbors`)
          return false;} //stay dead
    }
}

//Given a grid and a coordinate on that grid, returns the number of living cells adjacent
const checkNeighbor = (grid, i, j) => {
    let total = 0;
    for (let x = i-1; x <= i+1; x++){
      for (let y = j-1; y <= j+1; y++){
        if (x >= 0 && x < grid.length && y >= 0 && y < grid.length){  //check if within bounds of grid
            if (grid[x][y]){
              total += 1; 
            } 
        } 
      }
    }
    if (grid[i][j] == false) return total;
    else return total-1;  //exclude middle bit
}

const GetNewGrid = (grid) => {
  let newGrid = getEmptyGrid();
  for(let i = 0; i < grid.length; i++){
    for(let j = 0; j < grid.length; j++){
      newGrid[i][j] = determineNextGen(grid, i, j);
    }
  }
  return newGrid;
}

var reqTimeout;

const RunSimulation = (grid, context) => {
  drawGrid(grid, context);
  const newGrid = GetNewGrid(grid);

  reqTimeout = setTimeout(function(){requestAnimationFrame(RunSimulation(newGrid, context))}, 100);
}

var isStarted = 0;
const grid = getEmptyGrid();

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  
  
  var startStop = document.createElement('button');
  startStop.id = 'ssButton';
  startStop.innerHTML = 'Start/Stop';
  startStop.style.background = '#ff0000';
  document.body.appendChild(startStop);
  startStop.onclick = function() {
    if(isStarted == 0)  //initial state
    {
      RunSimulation(drawingLetters(grid), context);
      isStarted = 1;
    }
    else if(isStarted == 1) //started state
    {
      clearTimeout(reqTimeout);
      isStarted = 2;
    }
    else  //paused state
    {
      RunSimulation(grid, context);
      isStarted = 1;
    }
  };
  // startStop.onclick = function() {RunSimulation(drawingLetters(grid), context);};
