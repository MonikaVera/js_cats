import { setCookie, getCookie, deleteCookie } from "./cookies.js"
const audio = new Audio("meow.mp3");

const name1 = document.querySelector("#name1");
const name2 = document.querySelector("#name2");
const boardsize = document.querySelector("#sizeboard");
const numcats = document.querySelector("#numcats");
const btn = document.querySelector("#btn");
const maxpoints = document.querySelector("#points");
const form = document.querySelector("#form");
const curTurn = document.querySelector("#curturn");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const previous = document.querySelector("#previous");
const bntnewgame = document.querySelector("#bntnewgame");
bntnewgame.addEventListener("click", OnNewGame);
window.addEventListener("load", Onload);
btn.addEventListener("click", OnBtnClick);

const bench1= document.querySelector("#bench1 > tbody");
const bench2= document.querySelector("#bench2 > tbody");
const board= document.querySelector("#board > tbody");
const winnerText = document.querySelector("#winner");
board.addEventListener("mouseover", (event)=>OnHover(event));
board.addEventListener("mouseout", (event)=>OnOut(event));
board.addEventListener("click", OnClick);

bench1.addEventListener("dragstart", handleDragStartBlack);
bench1.addEventListener("dragend", handleDragEnd);
bench2.addEventListener("dragstart", handleDragStartGray);
bench2.addEventListener("dragend", handleDragEnd);
board.addEventListener("dragover", (event) => {event.preventDefault(); OnHover(event)});
board.addEventListener("dragleave", (event) => {event.preventDefault(); OnOut(event)})
board.addEventListener("drop", handleDrop);

let boardSize=6;
let benchSize=8;
let maxPoints=5;
let turns=true;
let boardArr=[];
let blackbenchLength=benchSize;
let graybenchLength=benchSize;
let blackPoints=0;
let grayPoints=0;
let canDrag=false;
let blackName="Lee";
let grayName="Tas";
const blackCatPicture = `<img src="black_cat.png">`;
const grayCatPicture = `<img src="gray_cat.png">`;
const blackCatPink = `<img src="black_cat_pink.png">`;
const grayCatPink = `<img src="gray_cat_pink.png">`;
/*
0-empty
1-black
2-gray
*/ 

function Onload() {
    if(getCookie("name1")!="" && getCookie("points2")!="") {
        previous.innerText=`Előző játék:
        ${getCookie("name1")}: ${getCookie("points1")} pont,
        ${getCookie("name2")}: ${getCookie("points2")} pont, 
        győztes: ${getCookie("winner")}
        ekkor: ${getCookie("time")}`;
    }
    else {
        previous.innerText="Nem volt előző játék";
    }
    
}

function OnBtnClick() {
    if(name1.value!="") {
        blackName=name1.value;
    }
    if(name2.value!="") {
        grayName=name2.value;
    }
    boardSize=boardsize.value;
    benchSize=numcats.value;
    blackbenchLength=benchSize;
    graybenchLength=benchSize;
    maxPoints=maxpoints.value;
    player1.innerText = `${blackName}: ${blackPoints} pont`;
    player2.innerText = `${grayName}: ${grayPoints} pont`;
    curTurn.innerText = `${blackName} következik`;

    board.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        const row = board.insertRow();
        for (let j = 0; j < boardSize; j++) {
            row.insertCell();
            boardArr.push(0);
        }
    }

    bench1.innerHTML = "";
    const row1 = bench1.insertRow();
    for (let j = 0; j < benchSize; j++) {
        row1.insertCell().innerHTML=blackCatPicture;
    }

    bench2.innerHTML= "";
    const row2 = bench2.insertRow();
    for (let j = 0; j < benchSize; j++) {
        row2.insertCell().innerHTML=grayCatPicture;
    }

    btn.removeEventListener("click", OnBtnClick);
    form.remove();
    previous.hidden=true;
    document.querySelector("#bench1").hidden=false;
    document.querySelector("#bench2").hidden=false;
    document.querySelector("#board").hidden=false;
    player1.hidden=false;
    player2.hidden=false;
    curTurn.hidden=false;
    audio.play();
}

function handleDragStartBlack(e) {
    if(turns) {
        canDrag=true;
    }
    e.target.style.opacity = '0.4';
}

function handleDragStartGray(e) {
    if(!turns) {
        canDrag=true;
    }
    e.target.style.opacity = '0.4';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDrop(e) {
    e.preventDefault();
    if(canDrag) {
        OnClick(e);
        canDrag=false;
    }
    
}

function OnClick(e) {
    const row = e.target.closest("tr").rowIndex;
    const col = e.target.closest("td").cellIndex;
    let cell = board.rows[row].cells[col];
    if(boardArr[row*boardSize+col]==0) {
        if(turns) {
            boardArr[row*boardSize+col]=1;
            cell.innerHTML=blackCatPicture;
            let toEmpty = bench1.rows[0].cells[blackbenchLength-1];
            toEmpty.innerHTML="";
            blackbenchLength--;
            turns=false;
            moveCats(row, col);
            threeCats();
            curTurn.innerText = `${grayName} következik`;
        } else {
            boardArr[row*boardSize+col]=2;
            cell.innerHTML=grayCatPicture;
            let toEmpty = bench2.rows[0].cells[graybenchLength-1];
            toEmpty.innerHTML="";
            graybenchLength--;
            turns=true;
            moveCats(row, col);
            threeCats();
            curTurn.innerText = `${blackName} következik`;
        }
    audio.play();
    winner();
    }
}

function winner() {
    let won=false;
    if(blackPoints==maxPoints || graybenchLength==0) {
        winnerText.innerText=`${blackName} nyert!`;
        setCookie("winner", blackName);
        won=true;
    }
    if(grayPoints==maxPoints || blackbenchLength==0) {
        winnerText.innerText=`${grayName} nyert`;
        setCookie("winner", grayName);
        won=true;
    }

    if(won) {
        board.removeEventListener("click", OnClick);
        board.removeEventListener("drop", handleDrop);
        setCookie("name1", blackName);
        setCookie("name2", grayName);
        setCookie("points1", blackPoints);
        setCookie("points2", grayPoints);
        const d = new Date();
        let time =`${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}. ${d.getHours()}:${d.getMinutes()}`;
        setCookie("time", time);
        bntnewgame.hidden=false;
        winnerText.hidden=false;
    }
}
    

function moveCats(row, col) {
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            if(row+i>=0 && row+i<boardSize && col+j>=0 && col+j<boardSize) {
                //van macska körülötte
                let cell = board.rows[row+i].cells[col+j];
                if(boardArr[(row+i)*boardSize+col+j]!=0) {
                    if(row+2*i>=0 && row+2*i<boardSize && col+2*j>=0 && col+2*j<boardSize) {
                        //van hove ellökni
                        if(boardArr[(row+i*2)*boardSize+col+j*2]==0) {
                            //nincs cica ott ahova lökni kell
                            boardArr[(row+i*2)*boardSize+col+j*2]=boardArr[(row+i)*boardSize+col+j];
                            boardArr[(row+i)*boardSize+col+j]=0;
                            let cell2 = board.rows[row+i*2].cells[col+j*2];
                            cell.innerHTML="";
                            if(boardArr[(row+i*2)*boardSize+col+j*2]==1) {
                                cell2.innerHTML = blackCatPicture;
                            } else {
                                cell2.innerHTML = grayCatPicture;
                            }
                        }
                    } else {
                        //megy a cica a kispadra
                        if(boardArr[(row+i)*boardSize+col+j]==1) {
                            let cell2=bench1.rows[0].cells[blackbenchLength];
                            cell2.innerHTML = blackCatPicture;
                            blackbenchLength++;
                        } else {
                            let cell2=bench2.rows[0].cells[graybenchLength];
                            cell2.innerHTML = grayCatPicture;
                            graybenchLength++;
                        }
                        cell.innerHTML="";
                        boardArr[(row+i)*boardSize+col+j]=0;
                    }
                }
            }
        } 
    }
}

function threeCats() {
    for(let  i=0; i<boardSize; i++) {
        for(let j=0; j<benchSize; j++) {
            if( boardArr[i*boardSize+j]!=0) {
                if(removethreeCats(i,j,-1,-1));
                else if(removethreeCats(i,j,-1,1));
                else if(removethreeCats(i,j,-1,0));
                else removethreeCats(i,j,0,-1);
            }
        }
    }
}

function removethreeCats(i, j, k1, l1) {
    if(i+k1>=0 && i+k1<boardSize && i-k1>=0 && i-k1<boardSize && 
    j+l1>=0 && j+l1<boardSize && j-l1>=0 && j-l1<boardSize && 
    boardArr[i*boardSize+j]==boardArr[(i+k1)*boardSize+j+l1]
    && boardArr[i*boardSize+j]==boardArr[(i-k1)*boardSize+j-l1]) {
        if( boardArr[i*boardSize+j]==1) {
            for(let i=0; i<3; i++) {
                let cell2=bench1.rows[0].cells[blackbenchLength];
                cell2.innerHTML = blackCatPicture;
                blackbenchLength++;
            }
            blackPoints++;
            player1.innerText = `${blackName}: ${blackPoints} pont`;
        } else {
            for(let i=0; i<3; i++) {
                let cell2=bench2.rows[0].cells[graybenchLength];
                cell2.innerHTML = grayCatPicture;
                graybenchLength++;
            }
            grayPoints++;
            player2.innerText = `${grayName}: ${grayPoints} pont`;
        }
        boardArr[i*boardSize+j]=0;
        boardArr[(i+k1)*boardSize+j+l1]=0;
        boardArr[(i-k1)*boardSize+j-l1]=0;
        board.rows[i].cells[j].innerHTML="";
        board.rows[i+k1].cells[j+l1].innerHTML="";
        board.rows[i-k1].cells[j-l1].innerHTML="";
        return true;
    }
    return false;
}


function OnHover(e) {
    const row = e.target.closest("tr").rowIndex;
    const col = e.target.closest("td").cellIndex;
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            if(row+i>=0 && row+i<boardSize && col+j>=0 && col+j<boardSize
                && !(j==0 && i==0)) {
                let cell2 = board.rows[row+i].cells[col+j];
                if(boardArr[(row+i)*boardSize+col+j]==1) {
                    cell2.innerHTML = blackCatPink;
                    cell2.style.backgroundColor = "pink"; 
                }
                if(boardArr[(row+i)*boardSize+col+j]==2) {
                    cell2.innerHTML = grayCatPink;
                    cell2.style.backgroundColor = "pink";
                }
            }
        }
    }

}

function OnOut(e) {
    const row = e.target.closest("tr").rowIndex;
    const col = e.target.closest("td").cellIndex;
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            if(row+i>=0 && row+i<boardSize && col+j>=0 && col+j<boardSize) {
                let cell2 = board.rows[row+i].cells[col+j];
                if(boardArr[(row+i)*boardSize+col+j]==1) {
                    cell2.innerHTML = blackCatPicture;
                }
                if(boardArr[(row+i)*boardSize+col+j]==2) {
                    cell2.innerHTML = grayCatPicture;
                }
                cell2.style.backgroundColor = "white";
            }
        }
    }
}

function OnNewGame() {
    for(let i=0; i<boardArr.length; i++) {
        boardArr[i]=0;
    }
    for(let i=0; i<boardSize; i++) {
        for(let j=0; j<boardSize; j++) {
            let cell = board.rows[i].cells[j];
            cell.innerHTML="";
        }
    }
    grayPoints=0;
    blackPoints=0;
    blackbenchLength=benchSize;
    graybenchLength=benchSize;
    for(let i=0; i<benchSize; i++) {
        let cell=bench1.rows[0].cells[i];
        let cell2=bench2.rows[0].cells[i];
        cell.innerHTML=blackCatPicture;
        cell2.innerHTML=grayCatPicture;
    }
    board.addEventListener("click", OnClick);
    board.addEventListener("drop", handleDrop);
    bntnewgame.hidden=true;
    winnerText.hidden=true;
}