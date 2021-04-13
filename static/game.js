const gridSize = 500;
const miniGridSize = 300
const numRowCells = 50;
const cellLength = (gridSize/numRowCells);
const miniCellLength = (miniGridSize/numRowCells);
var reqTimeout;
var isStarted = 0;
var speed = 50;
var genCount = document.getElementById("genCount");
var globalGrid; 
var globalContext;
var DMButton = document.querySelector('.DMButton');
var dark = false;
var startStop = document.querySelector('.start-stop');
var clearButton = document.querySelector('.clear');
var uploadButton = document.querySelector('.upload');
var gridsButton = document.querySelector('.grids');
var speedSlider = document.getElementById("speedSlider");
var output = document.getElementById("output");
var button = document.querySelector('button');
var uploadModal = document.getElementById("upload-modal");
var gridsModal = document.getElementById("grids-modal");
var uploadButtonModal = document.querySelector('.mini-upload-btn');
var gridName;

console.log(userGrids);

const drawGrid = (grid, contextIn) => {
  contextIn.clearRect(0, 0, gridSize, gridSize)
  let cellState, xPos, yPos;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      xPos = (cellLength * i); yPos = (cellLength * j); //set positioning for drawing cells
      contextIn.strokeRect(xPos, yPos, cellLength, cellLength) //draw outline for a box
      cellState = grid[i][j];
      if (cellState) contextIn.fillRect(xPos, yPos, cellLength, cellLength) //fill cell if state is alive
    }
  }
  globalContext = contextIn;
}

const drawMiniGrid = (grid, contextIn) => {
  contextIn.clearRect(0, 0, miniGridSize, miniGridSize)
  let cellState, xPos, yPos;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      xPos = (miniCellLength * i); yPos = (miniCellLength * j); //set positioning for drawing cells
      contextIn.strokeRect(xPos, yPos, miniCellLength, miniCellLength) //draw outline for a box
      cellState = grid[i][j];
      if (cellState) contextIn.fillRect(xPos, yPos, miniCellLength, miniCellLength) //fill cell if state is alive
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

var prevGlobalGrid = getEmptyGrid();

const drawingLetters = (grid) => {
  for(let j = 4; j < 14; j++) grid[1][j] = true;
  for(let j = 4; j < 14; j++) grid[2][j] = true;
  for(let i = 3; i < 9; i++) grid[i][8] = true;
  for(let i = 3; i < 9; i++) grid[i][9] = true;
  for(let j = 4; j < 14; j++) grid[7][j] = true;
  for(let j = 4; j < 14; j++) grid[8][j] = true;

  //E
  for(let j = 4; j < 14; j++) grid[11][j] = true;
  for(let j = 4; j < 14; j++) grid[12][j] = true;
  for(let i = 13; i < 19; i++) grid[i][4] = true;
  for(let i = 13; i < 19; i++) grid[i][5] = true;
  for(let i = 13; i < 17; i++) grid[i][8] = true;
  for(let i = 13; i < 17; i++) grid[i][9] = true;
  for(let i = 13; i < 19; i++) grid[i][12] = true;
  for(let i = 13; i < 19; i++) grid[i][13] = true;

  //L
  for(let j = 4; j < 14; j++) grid[21][j] = true;
  for(let j = 4; j < 14; j++) grid[22][j] = true;
  for(let i = 23; i < 29; i++) grid[i][12] = true;
  for(let i = 23; i < 29; i++) grid[i][13] = true;

  //L
  for(let j = 4; j < 14; j++) grid[31][j] = true;
  for(let j = 4; j < 14; j++) grid[32][j] = true;
  for(let i = 33; i < 39; i++) grid[i][12] = true;
  for(let i = 33; i < 39; i++) grid[i][13] = true;

  //O
  for(let j = 6; j < 12; j++) grid[41][j] = true;
  for(let j = 6; j < 12; j++) grid[42][j] = true;
  for(let i = 43; i < 47; i++) grid[i][4] = true;
  for(let i = 43; i < 47; i++) grid[i][5] = true;
  for(let i = 43; i < 47; i++) grid[i][12] = true;
  for(let i = 43; i < 47; i++) grid[i][13] = true;
  for(let j = 6; j < 12; j++) grid[47][j] = true;
  for(let j = 6; j < 12; j++) grid[48][j] = true;

  //W
  for(let j = 17; j < 26; j++) grid[0][j] = true;
  for(let j = 17; j < 26; j++) grid[1][j] = true;
  grid[2][22] = true; grid[2][23] = true; grid[3][22] = true; grid[3][23] = true;
  grid[4][20] = true; grid[4][21] = true; grid[5][20] = true; grid[5][21] = true;
  grid[6][22] = true; grid[6][23] = true; grid[7][22] = true; grid[7][23] = true;
  for(let j = 17; j < 26; j++) grid[8][j] = true;
  for(let j = 17; j < 26; j++) grid[9][j] = true;

  //O
  for(let j = 18; j < 24; j++) grid[12][j] = true;
  for(let j = 18; j < 24; j++) grid[13][j] = true;
  for(let i = 14; i < 18; i++) grid[i][16] = true;
  for(let i = 14; i < 18; i++) grid[i][17] = true;
  for(let i = 14; i < 18; i++) grid[i][24] = true;
  for(let i = 14; i < 18; i++) grid[i][25] = true;
  for(let j = 18; j < 24; j++) grid[18][j] = true;
  for(let j = 18; j < 24; j++) grid[19][j] = true;

  //R
  for(let j = 17; j < 26; j++) grid[22][j] = true;
  for(let j = 17; j < 26; j++) grid[23][j] = true;
  for(let i = 24; i < 28; i++) grid[i][16] = true;
  for(let i = 24; i < 28; i++) grid[i][17] = true;
  for(let i = 24; i < 28; i++) grid[i][20] = true;
  for(let i = 24; i < 28; i++) grid[i][21] = true;
  grid[28][18] = true; grid[28][19] = true; grid[29][18] = true; grid[29][19] = true;
  grid[26][22] = true; grid[26][23] = true; grid[27][22] = true; grid[27][23] = true;
  grid[28][24] = true; grid[28][25] = true; grid[29][24] = true; grid[29][25] = true;

  //L
  for(let j = 16; j < 26; j++) grid[32][j] = true;
  for(let j = 16; j < 26; j++) grid[33][j] = true;
  for(let i = 34; i < 40; i++) grid[i][24] = true;
  for(let i = 34; i < 40; i++) grid[i][25] = true;

  //D
  for(let j = 16; j < 26; j++) grid[42][j] = true;
  for(let j = 16; j < 26; j++) grid[43][j] = true;
  for(let i = 44; i < 48; i++) grid[i][16] = true;
  for(let i = 44; i < 48; i++) grid[i][17] = true;
  for(let i = 44; i < 48; i++) grid[i][24] = true;
  for(let i = 44; i < 48; i++) grid[i][25] = true;
  for(let j = 18; j < 24; j++) grid[48][j] = true;
  for(let j = 18; j < 24; j++) grid[49][j] = true;
  return grid;
} 


const eraseGrid = (grid) => {
  for(let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      grid[i][j] = false;
    }
  }
  return grid;
}

//Given a grid and a coordinate on that grid to check, will return a boolean value
//that states whether the cell should live or die off in the next generation
const determineNextGen = (grid, i, j) => {
    if (grid[i][j]) {//alive cell to start
      if (checkNeighbor(grid, i, j) == 2 || checkNeighbor(grid, i, j) == 3) return true;  // survives
      else return false; // dies out
    }
    else {//dead cell to start
      if (checkNeighbor(grid, i, j) == 3) return true; // cell is born
      else return false; // stay dead
    }
}

//Given a grid and a coordinate on that grid, returns the number of living cells adjacent
const checkNeighbor = (grid, i, j) => {
    let total = 0;
    for (let x = i-1; x <= i+1; x++){
      for (let y = j-1; y <= j+1; y++){
        if (x >= 0 && x < grid.length && y >= 0 && y < grid.length){  //check if within bounds of grid
            if (grid[x][y]) total += 1; 
        } 
      }
    }
    if (grid[i][j] == false) return total;  // if middle bit was already empty return total
    else return total-1;  // else subtract extra middle bit
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

//speed slider
speedSlider.oninput = function() {
  //clearTimeout(reqTimeout);
  speed = this.value;
  output.innerHTML = speed;

  //changing mid run
  //if(isStarted == 1) RunSimulation(globalGrid, globalContext, speed);
}

function RunSimulation (grid, context) {
  drawGrid(grid, context);
  if(globalGrid) prevGlobalGrid = globalGrid;
  const newGrid = globalGrid = GetNewGrid(grid); 
  genCount.innerHTML++;
  reqTimeout = setTimeout(function(){window.requestAnimationFrame(RunSimulation(newGrid, context))}, (2100/speed));
}

//start button
startStop.onclick = function() {
  if(isStarted == 0)  //initial state
  {
    RunSimulation(drawingLetters(globalGrid), globalContext);
    startStop.style.padding = '0px 83px';
    startStop.textContent = "Pause";
    isStarted = 1;
  }
  else if(isStarted == 1) //started state
  {
    clearTimeout(reqTimeout);
    startStop.style.padding = '0px 92px';
    startStop.textContent = "Start";
    isStarted = 2;
  }
  else  //paused state
  {
    RunSimulation(globalGrid, globalContext);
    startStop.style.padding = '0px 83px';
    startStop.textContent = "Pause";
    isStarted = 1;
  }
};

//clear button
clearButton.onclick = function() {
  clearTimeout(reqTimeout);
  drawGrid(eraseGrid(globalGrid), globalContext);
  startStop.style.padding = '0px 92px';
  startStop.textContent = "Start";
  genCount.innerHTML = 0;
  isStarted = 0;
};

//dark mode button
DMButton.onclick = function() {
  dark = !(dark);
  var element = document.body;
  element.classList.toggle("darkmode");
  if(dark){globalContext.strokeStyle = "black"; globalContext.fillStyle = "#00FF00";}
  else{globalContext.strokeStyle = "grey"; globalContext.fillStyle = "black";}
};

//upload button
//CHANGE THIS (IF THE SIMULATION IS RUNNING THIS BUTTON IS UNAVAILABLE)
uploadButton.onclick = function() {
  uploadModal.style.display = "block";
};

$(function() {  // SEND DATA TO FLASK
  $('#mini-upload').bind('click', function() {
    $.getJSON($SCRIPT_ROOT + '/UploadGrid',  // file path
    {userGridName: gridName, userGridState: JSON.stringify(prevGlobalGrid)}, // data being sent
    console.log("Upload Success"));  // success message
    return false;
  });
});

// gets gridName
uploadButtonModal.onclick = function(){  // how the button is called
  gridName = document.getElementById("t-box").value;
};

//grids button
//CHANGE THIS (IF THE SIMULATION IS RUNNING THIS BUTTON IS UNAVAILABLE)
gridsButton.onclick = function() {
  gridsModal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == uploadModal) uploadModal.style.display = "none";
  else if (event.target == gridsModal) gridsModal.style.display = "none";
};

const loadData = function(){
  var canvas, grid, gridName, context, clone, original;
  //document.querySelector('.user-grid-pair').remove()
  original = document.getElementById("user-grid-pair");
  if (userGrids.length > 0){
    for (var i = 0; i < 2; i++){  // first pair of grids
      //set values for user grids on screen
      gridName = userGrids[i].GridName;
      grid = JSON.parse(userGrids[i].GridState);
      if (i%2 == 0){
        canvas = original.querySelector('.left-grid-container').querySelector('.mini-grid')
        original.querySelector('.left-grid-container').querySelector('.user-grid-name').textContent = gridName;
      } 
      else{
        canvas = original.querySelector('.right-grid-container').querySelector('.mini-grid')
        original.querySelector('.right-grid-container').querySelector('.user-grid-name').textContent = gridName;
      } 
      canvas.title = i;
      context = canvas.getContext('2d');
      context.strokeStyle = "grey"; context.fillStyle = "black"
      drawMiniGrid(grid, context);
    }

    for (var i = 2; i < userGrids.length; i++){  // rest of grids
      //set values for user grids on screen
      gridName = userGrids[i].GridName;
      grid = JSON.parse(userGrids[i].GridState);
      if (i%2 == 0){
        clone = original.cloneNode(true);
        document.querySelector('.user-grids-window').appendChild(clone);
        canvas = clone.querySelector('.left-grid-container').querySelector('.mini-grid')
        clone.querySelector('.left-grid-container').querySelector('.user-grid-name').textContent = gridName;
      } 
      else{
        canvas = clone.querySelector('.right-grid-container').querySelector('.mini-grid')
        clone.querySelector('.right-grid-container').querySelector('.user-grid-name').textContent = gridName;
      } 
      canvas.title = i;
      context = canvas.getContext('2d');
      context.strokeStyle = "grey"; context.fillStyle = "black"
      drawMiniGrid(grid, context);
    }
    //For odd numbers of grids
    if(userGrids.length%2 != 0){
      clone.querySelector('.right-grid-container').style.display = "none";
    }
  }
  else{
    document.querySelector('.user-grid-pair').style.display = "none";
  }
}

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.strokeStyle = "grey"; context.fillStyle = "black"; //style cell drawing
  const grid = getEmptyGrid();
  drawGrid(grid, context);
  globalGrid = grid;
  globalContext = context;
  output.innerHTML = speedSlider.value;
  genCount.innerHTML = 0;
  loadData();
}