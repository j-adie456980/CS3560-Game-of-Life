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
var loadButtonModal = document.querySelector('.mini-load-btn');
var gridName;
var xOffset = $("#canvas").offset().left;
var yOffset = $("#canvas").offset().top;
var mouseDown = false;
var mouseButton = 0;

console.log(userGrids);
console.log(xOffset, yOffset);

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
    RunSimulation(globalGrid, globalContext);
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

// gets gridName
// Mini upload button
uploadButtonModal.onclick = function(){  // how the button is called
  gridName = document.getElementById("t-box").value;
};

// Mini upload button
loadButtonModal.onclick = function(){  // how the button is called
  const index = document.getElementById("grid-index-box").value;
  prevGlobalGrid = globalGrid = JSON.parse(userGrids[userGrids.length-index].GridState);
  console.log(prevGlobalGrid);
  console.log(globalGrid);
  drawGrid(globalGrid, globalContext);
  gridsModal.style.display = "none";
  genCount = 0;
};

$("#canvas").mousedown(function(e) {
  mouseDown = true;
  mouseButton = e.which;
  var x = Math.floor((e.pageX-xOffset) / cellLength)-1;
  var y = Math.floor((e.pageY-yOffset) / cellLength)-1;
  prevGlobalGrid[x][y] = globalGrid[x][y] = true;
  globalContext.fillStyle = mouseButton == 1 ? "black" : "white";
  globalContext.fillRect(x*cellLength, y*cellLength, cellLength, cellLength);
}).bind('mouseup', function() {
  mouseDown = false;
});

$("#canvas").mousemove(function(e) {
  if (mouseDown) {
      var x = Math.floor((e.pageX-xOffset) / cellLength)-1;
      var y = Math.floor((e.pageY-yOffset) / cellLength)-1;
      prevGlobalGrid[x][y] = globalGrid[x][y] = true;
      globalContext.fillStyle = mouseButton == 1 ? "black" : "white";
      globalContext.fillRect(x*cellLength, y*cellLength, cellLength, cellLength);
  }
});

$(function() {  // SEND DATA TO FLASK
  $('#mini-upload').bind('click', function() {
    $.getJSON($SCRIPT_ROOT + '/UploadGrid',  // file path
    {userGridName: gridName, userGridState: JSON.stringify(prevGlobalGrid)}, // data being sent
    console.log("Upload Success"));  // success message
    uploadModal.style.display = "none";
    return false;
  });
});

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
  var canvas, grid, gridName, context, clone, original, ID;
  original = document.getElementById("user-grid-pair");
  if (userGrids.length > 0){
    ID = userGrids.length;
    userGrids.reverse();
    for (var i = 0; i < 2; i++, ID--){  // first pair of grids
      //set values for user grids on screen
      gridName = userGrids[i].GridName;
      grid = JSON.parse(userGrids[i].GridState);
      if (i%2 == 0){
        canvas = original.querySelector('.left-grid-container').querySelector('.mini-grid')
        original.querySelector('.left-grid-container').querySelector('.user-grid-name').textContent = `${ID} \xa0\xa0|\xa0\xa0${gridName}`;
      } 
      else{
        canvas = original.querySelector('.right-grid-container').querySelector('.mini-grid')
        original.querySelector('.right-grid-container').querySelector('.user-grid-name').textContent = `${ID} \xa0\xa0|\xa0\xa0${gridName}`;
      } 
      context = canvas.getContext('2d');
      context.strokeStyle = "grey"; context.fillStyle = "black"
      drawMiniGrid(grid, context);
    }

    for (var i = 2; i < userGrids.length; i++, ID--){  // rest of grids
      //set values for user grids on screen
      gridName = userGrids[i].GridName;
      grid = JSON.parse(userGrids[i].GridState);
      if (i%2 == 0){
        clone = original.cloneNode(true);
        document.querySelector('.user-grids-window').appendChild(clone);
        canvas = clone.querySelector('.left-grid-container').querySelector('.mini-grid')
        clone.querySelector('.left-grid-container').querySelector('.user-grid-name').textContent = `${ID} \xa0\xa0|\xa0\xa0${gridName}`; 
      } 
      else{
        canvas = clone.querySelector('.right-grid-container').querySelector('.mini-grid')
        clone.querySelector('.right-grid-container').querySelector('.user-grid-name').textContent = `${ID} \xa0\xa0|\xa0\xa0${gridName}`;
      } 
      context = canvas.getContext('2d');
      context.strokeStyle = "grey"; context.fillStyle = "black"
      drawMiniGrid(grid, context);
    }
    if(userGrids.length%2 != 0){  //For odd numbers of grids
      clone.querySelector('.right-grid-container').style.display = "none";
    }
  }
  else{  //For empty database
    document.querySelector('.user-grid-pair').style.display = "none";
  }
}

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.strokeStyle = "grey"; context.fillStyle = "black"; //style cell drawing
  globalGrid = getEmptyGrid();
  globalContext = context;
  drawGrid(globalGrid, globalContext);
  output.innerHTML = speedSlider.value;
  genCount.innerHTML = 0;
  loadData();
}