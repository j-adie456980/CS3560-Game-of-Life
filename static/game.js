const gridSize = 500;
const numRowCells = 50;
const cellLength = (gridSize/numRowCells);

const drawGrid = (grid, contextIn) => {
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

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const grid = getEmptyGrid();
  for(let i = 0; i < grid.length; i++) grid[i][i] = true;
  drawGrid(grid, context);
}
