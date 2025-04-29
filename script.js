
const gameBoard = (function () {
    const arrayGrid = [];
    const arrSize = 9;

    for(let i = 0; i< arrSize; i++){
        arrayGrid.push(cell());
    }

    const getBoard = () => arrayGrid;

    function makeMark(mark,spot) {
        if(spot>arrSize-1){
           throw new Error(`Invalid Position Entered.`);
        }
        else{
            const available = arrayGrid[spot].getValue()===0;
        
            if(available){
            arrayGrid[spot].addMark(mark);
            }
            else{
                throw new Error(`Invalid Position.`)
            }
        }
    }

    const printBoard = () => {
        const displayArray = arrayGrid.map((square) => square.getValue());
        return displayArray;
    }

    function cell(){
        let value = 0;

        const getValue = () => value;

        const addMark = (player) =>{
            value = player
        }

        return {getValue, addMark}
    }

    return {getBoard,makeMark,printBoard};
})();

const gameControl = (function (){
    const players=[];
    let activePlayer = {};

    const playerCreate = (name) => {
        const playerName = name;
        const playerMark = players.length===0 ?`X`:`O`;
        players.push({playerName,playerMark});
        
        activePlayer = players[0];
    }

    const switchPlayer = () =>{
       activePlayer = activePlayer === players[0] ? players[1]:players[0];
       console.log(`${activePlayer.playerName}'s Turn`);
    }

    const makeMove = (spot) =>{
        gameBoard.makeMark(activePlayer.playerMark,spot);
        return activePlayer.playerMark;
    }

    const getplayers = () => players;

    function score(){
        const currentBoard = gameBoard.printBoard();

        if(currentBoard[0]===activePlayer.playerMark && currentBoard[1]===activePlayer.playerMark && currentBoard[2]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[3]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[5]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[6]===activePlayer.playerMark && currentBoard[7]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[0]===activePlayer.playerMark && currentBoard[3]===activePlayer.playerMark && currentBoard[6]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[1]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[7]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[2]===activePlayer.playerMark && currentBoard[5]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[0]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(currentBoard[2]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[6]===activePlayer.playerMark){
            console.log(`${activePlayer.playerName} Wins!`);
            return (`${activePlayer.playerName} Wins!`);
        }
        else if(!currentBoard.includes(0)){
            console.log(`Tie`);
            return(`Tie`);
        }
        else{
            switchPlayer();
        }
    }

    return {playerCreate,getplayers,makeMove,score};
})();

const displayControl= ( () => {

    const container = document.querySelector(`.container`);
    const gridSize = gameBoard.getBoard();

    function displayGrid(){
        gridSize.forEach((square) => {
            const sq = document.createElement(`div`);
            sq.setAttribute(`id`,`${gridSize.indexOf(square)}`);
            sq.setAttribute(`class`,`gridSquare`);

            container.appendChild(sq);
            container.addEventListener(`click`, userInput,{
                capture: true
            });
        });
    }

    function userInput(event){
        if(event.target !== container){
            event.stopPropagation();
            
            let currentMove = gameControl.makeMove(event.target.id);
            event.target.innerText = currentMove;
            const winState = gameControl.score();

            if(winState!==undefined){
                container.removeEventListener(`click`,userInput,{
                    capture: true
                });
            }

            console.log(gameBoard.printBoard());

        }
    }

    return {displayGrid}
})();



gameControl.playerCreate(`josh`);
gameControl.playerCreate(`venus`);


// gameControl.score();

displayControl.displayGrid();
