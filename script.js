
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
    }

    const makeMove = (spot) =>{
        gameBoard.makeMark(activePlayer.playerMark,spot);
        return activePlayer.playerMark;
    }

    const getplayers = () => players;
    const getCurrentPlayer = () => activePlayer;

    function score(){
        const currentBoard = gameBoard.printBoard();

        if(currentBoard[0]===activePlayer.playerMark && currentBoard[1]===activePlayer.playerMark && currentBoard[2]===activePlayer.playerMark){
            return ([0,1,2]);
        }
        else if(currentBoard[3]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[5]===activePlayer.playerMark){
            return ([3,4,5]);
        }
        else if(currentBoard[6]===activePlayer.playerMark && currentBoard[7]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            return ([6,7,8]);
        }
        else if(currentBoard[0]===activePlayer.playerMark && currentBoard[3]===activePlayer.playerMark && currentBoard[6]===activePlayer.playerMark){
            return ([0,3,6]);
        }
        else if(currentBoard[1]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[7]===activePlayer.playerMark){
            return ([1,4,7]);
        }
        else if(currentBoard[2]===activePlayer.playerMark && currentBoard[5]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            return ([2,5,8]);
        }
        else if(currentBoard[0]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[8]===activePlayer.playerMark){
            return ([0,4,8]);
        }
        else if(currentBoard[2]===activePlayer.playerMark && currentBoard[4]===activePlayer.playerMark && currentBoard[6]===activePlayer.playerMark){
            return ([2,4,6]);
        }
        else if(!currentBoard.includes(0)){
            return(`Tie`);
        }
        else{
            switchPlayer();
            return((`${activePlayer.playerName}'s Turn`));
        }
    }

    return {playerCreate,getplayers,getCurrentPlayer,makeMove,score};
})();

const displayControl= ( () => {

    const container = document.querySelector(`.container`);
    const textContainer = document.createElement(`div`);
    textContainer.setAttribute(`class`,`victory`);

    const winMsg = document.createElement(`p`);    
    textContainer.appendChild(winMsg);

    const gridSize = gameBoard.getBoard();
    const firstPlayer = gameControl.getplayers();

    function displayGrid(){

        gridSize.forEach((square) => {
            const sq = document.createElement(`div`);
            sq.setAttribute(`id`,`${gridSize.indexOf(square)}`);
            sq.setAttribute(`class`,`gridSquare sq${gridSize.indexOf(square)}`);

            container.appendChild(sq);

            container.addEventListener(`click`, winState,{
                capture: true
            });

            winMsg.innerText = `${firstPlayer[0].playerName}'s Turn`;
            container.appendChild(textContainer);
        });
    }

    function winState(event){

        if(event.target !== container){
            event.stopPropagation();

            let currentMove = gameControl.makeMove(event.target.id);
                if(currentMove===`X`){
                event.target.innerHTML=`<svg class="tics" id="${event.target.id}" width="150px" height="150px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" class="ticMark"> <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                            <polygon  id="${event.target.id}" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> 
                                            </polygon> </g> </g> </g> </g>
                                        </svg>` 
                }
                else if(currentMove===`O`){
                    event.target.innerHTML=`<svg class="toes" id="${event.target.id}" width="150px" height="150px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                                                <path id="${event.target.id}" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" class="tacMark" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                                            </svg>`
                }

            const state = gameControl.score();

            if(typeof(state)===`string`){
                if(state===`Tie`){
                    let square = document.querySelectorAll(`.gridSquare`);
                    square.forEach((sq) =>{
                        if(sq.innerHTML.includes(`tics`)){
                            sq.innerHTML=`<svg class="tics" id="${event.target.id}" style="filter: drop-shadow(3px 5px 2px rgb(0,0,0,0.4));" width="150px" height="150px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" class="ticMarkL"> <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                            <polygon  id="${event.target.id}" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> 
                                            </polygon> </g> </g> </g> </g>
                                        </svg>` 
                        }
                        else if(sq.innerHTML.includes(`toes`)){
                            sq.innerHTML=`<svg class="toes"  id="${event.target.id}" style="filter: drop-shadow(3px 5px 2px rgb(0,0,0,0.4));" width="150px" height="150px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                                                <path id="${event.target.id}" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" class="tacMarkL" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                                            </svg>`
                        }
                    })
                    container.removeEventListener(`click`,winState,{
                        capture:true
                    });
                }
                winMsg.innerText = state;
            }
            else{
                const winner = gameControl.getCurrentPlayer();
                winMsg.innerText = `${winner.playerName} wins the game!`

                if(winner.playerMark===`X`){
                    state.forEach((id) =>{
                    let square = document.querySelector(`.sq${id}`)
                    square.innerHTML = `<svg style="filter: drop-shadow(3px 5px 2px rgb(0,0,0,0.4));" class="tics" id="${event.target.id}" width="150px" height="150px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" class="ticMarkW"> <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                            <polygon  id="${event.target.id}" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"> 
                                            </polygon> </g> </g> </g> </g>
                                        </svg>` 
                    });
                }
                else if(winner.playerMark===`O`){
                    state.forEach((id) =>{
                        let square = document.querySelector(`.sq${id}`)
                        square.innerHTML = `<svg style="filter: drop-shadow(3px 5px 2px rgb(0,0,0,0.4));" class="toes" id="${event.target.id}" width="150px" height="150px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
                                                <path id="${event.target.id}" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" class="tacMarkW" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                                            </svg>`
                        });
                }

                container.removeEventListener(`click`,winState,{
                    capture:true
                });
            }
        }
    }

    return {displayGrid}
})();



gameControl.playerCreate(`Player 1`);
gameControl.playerCreate(`Player 2`);

displayControl.displayGrid();
