
const gameBoard = (function () {
    let arrayGrid = [];
    const arrSize = 9;

    function createBoard(){
        for(let i = 0; i< arrSize; i++){
        arrayGrid.push(cell());
        }
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
                throw new Error(`Invalid Position.`);
            }
        }
    }

    function clearBoard(){
        arrayGrid=[];
        createBoard();
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

    const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

    const getWinningCombos = () => winningCombos;

    return {getBoard,makeMark,createBoard,printBoard,getWinningCombos};
})();

const gameControl = (function (){
    const players=[];
    let activePlayer = {};

    const playerCreate = (name) => {
        if(players.length===2){
            players.pop();
            players.pop();
        }
        const playerName = name;
        const playerMark = players.length===0 ?`X`:`O`;
        players.push({playerName,playerMark});
        
        activePlayer = players[0];
    }

    const clearPlayer = () =>{
        players.pop();
        players.pop();
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

    return {playerCreate,getplayers,getCurrentPlayer,makeMove,score,clearPlayer};
})();

const cpuAi = (function(){
    let cpuTurn;
    function powerOn(){
        gameControl.playerCreate(`CPU`);
    }

    const opponent = gameControl.getplayers();
    const winCombos = gameBoard.getWinningCombos();
    let board = gameBoard.getBoard();
    let pos = [];

    function checkCpu(){

        let emptyPos = [];
        let playerPos = [];
        let takenPos = [];
        let cpuPos = [];
        let cpuCan = [];
        let playerCan = [];
        let cpuAll = [];

        board.forEach((square) =>{
            if(square.getValue() === 0){
                emptyPos.push(board.indexOf(square));
            }
            if(square.getValue() !== 0){
                takenPos.push(board.indexOf(square));

                if(square.getValue() === opponent[0].playerMark){
                    playerPos.push(board.indexOf(square));
                }
                if(square.getValue() === opponent[1].playerMark){
                    cpuPos.push(board.indexOf(square));
                }
            }
        });


        if(playerPos.length===0){
            console.log(`cpu moves first`);
        }

        if(cpuPos.length===0){
            if(emptyPos.includes(4)){
                const rand = Math.random();
                if(rand > 0.5){
                    cpuTake(4);  
                }
                else{
                const other = Math.floor(Math.random() * emptyPos.length);
                cpuTake(emptyPos[other]);
                }
            }
            else{
                const rand = Math.floor(Math.random() * emptyPos.length);
                cpuTake(emptyPos[rand]);
            }
        }
        else{
            winCombos.forEach((combo) =>{
                const [a,b,c] = combo;
                if(cpuPos.includes(a) || cpuPos.includes(b) || cpuPos.includes(c)){
                    cpuAll.push(combo);
                }
                if(takenPos.includes(a) && takenPos.includes(b) && board[c].getValue() === 0){
                   if(board[a].getValue() === board[b].getValue()){
                        if(board[a].getValue() === opponent[1].playerMark){
                            cpuCan.push(c);
                        }
                        else{
                            playerCan.push(c);
                        }
                   }
                }
                if(takenPos.includes(b) && takenPos.includes(c) && board[a].getValue() === 0){
                    if(board[b].getValue() === board[c].getValue()){
                        if(board[b].getValue() === opponent[1].playerMark){
                            cpuCan.push(a);
                        }
                        else{
                            playerCan.push(a);
                        }
                   }
                }
                if(takenPos.includes(a) && takenPos.includes(c) && board[b].getValue() === 0){
                    if(board[a].getValue() === board[c].getValue()){
                        if(board[a].getValue() === opponent[1].playerMark){
                            cpuCan.push(b);
                        }
                        else{
                            playerCan.push(b);
                        }
                   }
                }
            });
            let opt = optimalPosition(cpuCan, playerCan);
            cpuTake(opt);
        }

        function optimalPosition(cpuArr, playerArr){
            console.log(cpuArr,playerArr);
            let finalpos = [];

            if(playerArr.length === 0 && cpuArr.length === 0){
                cpuAll.forEach((arr) =>{
                    emptyPos.forEach((el) =>{
                        if(arr.includes(el)){
                            if(!finalpos.includes(el)){
                                finalpos.push(el);
                            }
                        }
                    });
                });
               const rand = Math.floor(Math.random() * finalpos.length);
               return finalpos[rand]; 
            }
            else if(cpuArr.length === 0 && playerArr.length!==0){
                const rand = Math.floor(Math.random() * playerArr.length);
                return playerArr[rand];
            }
            else if(cpuArr.length !== 0 && playerArr.length === 0){
                return cpuArr[0];
            }
            else{
                return cpuArr[0];
            }
        }
    }

    function cpuTake(pos){
        cpuTurn = pos;
        console.log(`The cpu wishes to move to`, cpuTurn);
    }

    const getCpuTurn = () => cpuTurn;

    return{powerOn,getCpuTurn,checkCpu}

})();

const playBtn = document.querySelector(`#play`);
const resetBtn = document.querySelector(`#reset`);
const cont = document.querySelector(`.container`);
const icon = document.querySelector(`.userIcon`);
const iconTxt = document.querySelector(`.userLabel`);

function playerSelect(){

    if(iconTxt.innerText === `PvP`){
        iconTxt.innerText = `CPU`;
        gameControl.playerCreate(`Player`);
        gameControl.playerCreate(`CPU`);
        icon.innerHTML = `<svg id="comp" fill="#000000" height="64px" width="64px" version="1.1" id="XMLID_167_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M24,23H0v-7h2V1h20v15h2V23z M2,21h20v-3H2V21L2,21z M4,16h16V3H4V16z M18,14H6V5h12V14z M8,12h8V7H8V12z"></path> </g> </g></svg>`
    }
    else if(iconTxt.innerText ===`CPU`){
        iconTxt.innerText = `PvP`;
        gameControl.playerCreate(`Player 1`);
        gameControl.playerCreate(`Player 2`);
        icon.innerHTML = `<svg id="guy" class="" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 20V18C13 15.2386 10.7614 13 8 13C5.23858 13 3 15.2386 3 18V20H13ZM13 20H21V19C21 16.0545 18.7614 14 16 14C14.5867 14 13.3103 14.6255 12.4009 15.6311M11 7C11 8.65685 9.65685 10 8 10C6.34315 10 5 8.65685 5 7C5 5.34315 6.34315 4 8 4C9.65685 4 11 5.34315 11 7ZM18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    }
    console.log(gameControl.getplayers());
}

icon.addEventListener(`click`, playerSelect);

function startGame(){
    if(gameControl.getplayers().length===0){
        gameControl.playerCreate(`Player 1`);
        gameControl.playerCreate(`Player 2`);
    }
    displayControl.displayGrid();
}

playBtn.addEventListener(`click`,startGame);

resetBtn.addEventListener(`click`,() =>{
    location.reload();
});

const displayControl= (() => {

    gameBoard.createBoard();
    const container = document.querySelector(`.container`);
    const instBox = document.querySelector(`.winText`);
    const textContainer = document.createElement(`div`);
    textContainer.setAttribute(`class`,`victory`);

    const winMsg = document.createElement(`p`);    
    textContainer.appendChild(winMsg);


    const firstPlayer = gameControl.getplayers();

    function displayGrid(){    
        const gridSize = gameBoard.getBoard();

        playBtn.removeEventListener(`click`,startGame);
        gridSize.forEach((square) => {
            const sq = document.createElement(`div`);
            sq.setAttribute(`id`,`${gridSize.indexOf(square)}`);
            sq.setAttribute(`class`,`gridSquare sq${gridSize.indexOf(square)}`);

            container.appendChild(sq);

            container.addEventListener(`click`, winState,{
                capture: true
            });

            winMsg.innerText = `${firstPlayer[0].playerName}'s Turn`;
            instBox.appendChild(textContainer);
        });

    }
    
    function cpuClick(){
        const active = gameControl.getCurrentPlayer();
        if(active.playerName===`CPU`){

            cpuAi.checkCpu();
            const move = cpuAi.getCpuTurn();
            console.log(`we have it here`,move);

            const cpusq = document.querySelector(`.sq${move}`);
            
            setTimeout(() => {
                cpusq.click();
            }, 300);

        }
        else{
            return;
        }

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
            cpuClick();

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

    return {displayGrid,winState}
})();



