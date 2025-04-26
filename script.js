
const gameBoard = (function () {
    const arrayGrid = [];
    const arrSize = 9;


    for(let i = 0; i< arrSize; i++){
        arrayGrid.push(cell());
    }

    const getBoard = () => arrayGrid;

    function makeMark(mark) {
       const available = arrayGrid.filter((square) => square.getValue() === 0);
       
       if(available){
        arrayGrid[available.length-1].addMark(mark);
       }
    }

    const printBoard = () => {
        const displayArray = arrayGrid.map((square) => square.getValue());
        console.log(displayArray);
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
    }

    const makeMove = () =>{
        gameBoard.makeMark(activePlayer.playerMark);
        switchPlayer();
        console.log(`${activePlayer.playerName}'s Turn`);
    }

    const getplayers = () => players;

    return {playerCreate,getplayers,makeMove};
})();

gameControl.playerCreate(`josh`);
gameControl.playerCreate(`venus`);
console.log(gameControl.getplayers());

gameControl.makeMove();
gameBoard.printBoard();

