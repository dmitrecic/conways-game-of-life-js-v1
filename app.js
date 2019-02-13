/*
 *  Conway's game of life
 *  Rules and explanation: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 *  Author: Dragutin Mitrecic dmitrecic@gmail.com, February 12th 2019.
 *  
 *  I got this task as a test task at one company where I was applying for a job position
 *  I created 2 versions of implementation of this game in pure JavaScript, 
 *  this is the first one where I use one two-dimensional array as a container of the cells states
 *  for next generation.
 * 
 *  Current cells generation data is get from the grid at the screen (cell state is set by class name "alive").
 * 
 *  nextGen array is used to store and create new states of the cells for new generation 
 *  from the current generation at the screen, respective to the rules of the game.
 *  
 *  When rules are applied, nextGen grid is shown at the grid on screens, 
 *  nextGen array data are set to zero (erased) and the proccess starts again.
 *  
 */

var width=200;              // grid width
var height=200;             // grid height
var ticks=200;              // ticks (cycles)
var delay=150;              // delay between ticks (cycles)
var populationPercent=25;   // percentage of first population

var startingPopulation=calculatePopulationFromPercent(width*height,populationPercent);
var grid=document.getElementById("grid");

var nextGen=[];             // initialize next generation array grid

var n=0;                    // initialize variable for counting first population

/***********************************
 *                                 *
 *  LET'S START THE GAME OF LIFE   *
 *                                 *
************************************/

initializeWorld();          // create world for new life
createFirstPopulation();    // create first population
tickingLife(ticks,delay);   // start the game of life



/******************************************
 *  BELOW IS THE LOGIC PART OF THE GAME   *
*******************************************/

function initializeWorld()
{
    // Initialize "world" for new life 
    // create grid and arrays for current and next generation

    for(row=0;row<height;row++)
    {
        nextGen[row]=[];
        
        for(col=0;col<width;col++)
        {
            var cell=document.createElement("div");
            cell.setAttribute("id",cellId(row,col));
            
            grid.appendChild(cell);
            nextGen[row][col]=0;
        }
    }
}
function createFirstPopulation()
{
    // create first (starting) population
    while(n<startingPopulation)
    {
        posRow=randomPos(height);   // random position in the grids height
        posCol=randomPos(width);    // random position in the grids width

        if (checkFieldState(posRow,posCol)==0){
            displayField(posRow,posCol);
            n++;    
        }
    }
}

function displayField(row,col)
{
    // display cell state on the grid at the screen (alive)
    document.getElementById(cellId(row,col)).classList.add("alive");
}
function resetField(row,col)
{
    // remove "alive" class from the cell element at the screen (not alive = dead)
    document.getElementById(cellId(row,col)).classList.remove("alive");
}

function checkFieldState(row,col)
{
    // return the state of the specific cell 
    // 1 if it is alive, 
    // 0 if it doesn't have "alive" class - is dead

    return (document.getElementById(cellId(row,col)).classList.contains("alive") ? 1 : 0);
}

function tickingLife(ticks, delay){
    
    // loop over the ticks of life
    // with delay

    if (ticks){
        checkPopulation();
        setTimeout(
            () => { tickingLife(ticks - 1, delay); //recursive call
            },delay);
    }
}

function calculatePopulationFromPercent(total, percent)
{
    // calculate first population 
    return (total/100)*percent;
}

function randomPos(max)
{
    // return random number
    return Math.floor(Math.random()*max);
}

function cellId(row,col)
{
    // return cell id 
    return "f-"+row+"-"+col;
}

function applyRules(row,col,totalNeighboors)
{
    // if this cell is dead and neighboors number is 
    // equal to 3, then let it live in the next generation

    if (totalNeighboors==3 && checkFieldState(row,col)==0)
    {
        nextGen[row][col]=1;
    }
    
    // if current cell is live, apply the rules
    // regarding to the number of it's neighboors
    // to the next generation

    if (checkFieldState(row,col) == 1) {

        if (totalNeighboors<2 || totalNeighboors>3)
        {
            nextGen[row][col]=0;
        } else {
            nextGen[row][col]=1;
        }
    }
}

function displayGrid()
{
    // display data from nextGen array 
    // to the screen and erase data from nextGen array to prepare 
    // for next generation
    // (not neccessary, but I like it to be clean for the next cycle)

    for (var row=0; row<height; row++) 
    { 
        for (var col=0; col<width; col++) 
        {
            if (nextGen[row][col]==1){
                displayField(row,col);
            } else {
                resetField(row,col);
            }
            
            nextGen[row][col]=0;
        }
    }
}


function lookAround(row,col)
{
    // look for the living cells around this cell
    // and count if there is any

    totalNeighboors=0;

    totalNeighboors+=checkFieldState(row-1,col);    // look up
    totalNeighboors+=checkFieldState(row+1,col);    // look down
    totalNeighboors+=checkFieldState(row,col-1);    // look left
    totalNeighboors+=checkFieldState(row,col+1);    // look right
    totalNeighboors+=checkFieldState(row-1,col-1);  // look up left
    totalNeighboors+=checkFieldState(row-1,col+1);  // look up right
    totalNeighboors+=checkFieldState(row+1,col-1);  // look down left
    totalNeighboors+=checkFieldState(row+1,col+1);  // look down right

    return totalNeighboors;
}


function checkPopulation()
{
    // check the state of the cell regarding to
    // it's neighboors and store the new cell state
    // into the nextGen data grid

    for (row=1;row<height-1;row++)
    {
        for (col=1;col<width-1;col++)
        {
            totalNeighboors = lookAround(row,col);
            // apply rules
            applyRules(row,col,totalNeighboors);
        }
            
    }

    // display the nextGen (next generation) grid to the screen
    displayGrid();

}