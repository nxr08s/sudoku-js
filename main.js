function newGameAction() {
    function element(val){
        this.value = val;
        this.permanent = false;
        this.permanentOnStart = false;
        this.displayedValue = null;
    }

    var fillOrder = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    var gameGrid = [[],[],[],[],[],[],[],[],[]];

    var startNumber = 0;
    for (var i of fillOrder){
        for (var j = 0; j < 9; j++){
            gameGrid[fillOrder[startNumber]].push(new element(1 + (startNumber + j) % 9));
        }
        startNumber++;
    }
    document.gameGrid = gameGrid;
    document.usedHints = 0;
    document.gameTime = 0;
    document.timerId = setInterval(secondTick, 1000);
    // console.log("timer setted");
    shuffleGrid();
    removeCells();
    displayGrid();
}
function swapHorizontalLines(sector, a, b){
    var temp = 0;
    for (var i = 0; i < 9; i++){
        temp = document.gameGrid[sector * 3 + a][i];
        document.gameGrid[sector * 3 + a][i] = document.gameGrid[sector * 3 + b][i];
        document.gameGrid[sector * 3 + b][i] = temp;
    }
}
function swapVerticalLines(sector, a, b){
    var temp = 0;
    for (var i = 0; i < 9; i++){
        temp = document.gameGrid[i][sector * 3 + a];
        document.gameGrid[i][sector * 3 + a] = document.gameGrid[i][sector * 3+ b];
        document.gameGrid[i][sector * 3 + b] = temp;
    }
}
function swapVerticalSectors(a, b){
    var temp = 0;
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 9; j++){
            temp = document.gameGrid[j][a * 3 + i];
            document.gameGrid[j][a * 3 + i] = document.gameGrid[j][b * 3 + i];
            document.gameGrid[j][b * 3 + i] = temp;
        }
    }
}
function swapHorizontalSectors(a, b){
    var temp = 0;
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 9; j++){
            temp = document.gameGrid[a * 3 + i][j];
            document.gameGrid[a * 3 + i][j] = document.gameGrid[b * 3 + i][j];
            document.gameGrid[b * 3 + i][j] = temp;
        }
    }
}
function shuffleGrid(){
    // 1 time shuffle vertical sectors
    var a = Math.trunc(Math.random() * 2.5), b;
    do{ b = Math.trunc(Math.random() * 2.5); }while (b == a);

    swapVerticalSectors(a, b);

    // 5 times shuffle horizontal lines
    for (var i = 0; i < 5; i++){
        var a = Math.trunc(Math.random() * 2.5),
            sector = Math.trunc(Math.random() * 2.5), b;
        do{ b = Math.trunc(Math.random() * 2.5); }while (b == a);

        swapHorizontalLines(sector, a, b);
    }

    // 1 time shuffle horizontals sector
    var a = Math.trunc(Math.random() * 2.5), b;
    do{ b = Math.trunc(Math.random() * 2.5); }while (b == a);

    swapHorizontalSectors(a, b);

    // 5 times shuffle vertical lines
    for (var i = 0; i < 5; i++){
        var a = Math.trunc(Math.random() * 2.5),
            sector = Math.trunc(Math.random() * 2.5), b;
        do{ b = Math.trunc(Math.random() * 2.5); }while (b == a);

        swapVerticalLines(sector, a, b);
    }
}
function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
function removeCells(){
    // here we can change difficult by decrease/increase number of
    //	cell to show from beginning
    var toShow = Math.round(Math.random() * 10 + 30);

    // var toShow = 77;

    // span array with elem indices
    var spanArr = [];
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            spanArr.push([i,j]);
    spanArr = shuffle(spanArr);

    for (var i = 0; i < toShow; i++){
        var grid = document.gameGrid;
        grid[spanArr[i][0]][spanArr[i][1]].permanent = true;
        grid[spanArr[i][0]][spanArr[i][1]].permanentOnStart = true;
    }
    document.numberOfEmptyCells = 81 - toShow;
    document.numOfOpenedOnStart = toShow;
}
// cell-46
function checkCell(row, col){
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    arr = checkSector(Math.trunc(row / 3), Math.trunc(col / 3), arr);
    if (!arr.length)
        return [];
    arr = checkRow(row, arr);
    if (!arr.length)
        return [];
    arr = checkLine(col, arr);
    return arr;
}
function checkSector(row, col, arr){
    for (var i = row * 3; i < row * 3 + 3; i++)
        for (var j = col * 3; j < col * 3 + 3; j++){
            var index = arr.indexOf(document.gameGrid[i][j].displayedValue);
            if (index != -1) 
                arr.splice(index, 1);
        }
    return arr;
}
function checkRow(row, arr){
    for (var i = 0; i < 9; i++){
        var index = arr.indexOf(document.gameGrid[row][i].displayedValue);
        if (index != -1)
            arr.splice(index, 1);
    }
    return arr;
}
function checkLine(line, arr){
    for (var i = 0; i < 9; i++){
        var index = arr.indexOf(document.gameGrid[i][line].displayedValue);
        if (index != -1)
            arr.splice(index, 1);
    }
    return arr;
}
function displayGrid() {
    var arr = document.gameGrid;
    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
            var elem = document.getElementById("cell-"+(i + 1)+(j + 1));
            if (arr[i][j].permanentOnStart){
                elem.innerHTML = arr[i][j].value;
                elem.className += " grid-cell-permanent";
                arr[i][j].displayedValue = arr[i][j].value;
            }else{
                elem.className += " grid-cell-available";
                elem.addEventListener("click", cellClicked);
                arr[i][j].permanent = false;
                arr[i][j].displayedValue = null;
            }
        }
    }
}
function clearGrid() {
    for (var i = 1; i < 10; i++)
        for (var j = 1; j < 10; j++){
            var elem = document.getElementById("cell-" + i + j);
            elem.className = "grid-cell";
            elem.innerHTML = "";
            elem.removeEventListener("click", cellClicked);
        }
}
function pageInit() {
    document.blurLayout = document.getElementById("blur-layer");
    document.menuBox = document.getElementsByClassName("menu-header")[0];
    document.timer = document.getElementsByClassName("timer-box")[0];
    newGameAction();
}
function menuClicked() {
    showMenu(true);
    showBlurLayer(true);
    document.menuBox.removeEventListener("click", menuClicked);
    document.menuBox.addEventListener("click", menuExit);
    document.blurLayout.addEventListener("click", menuExit);
    // console.log("timer paused");
    clearInterval(document.timerId);
}
function menuExit(resumeTimer){
    showMenu(false);
    showBlurLayer(false);
    document.blurLayout.removeEventListener("click", menuExit);
    document.menuBox.removeEventListener("click", menuExit);
    if (resumeTimer){
        // console.log("timer resumed");
        document.menuBox.addEventListener("click", menuClicked);
        document.timerId = setInterval(secondTick, 1000);
    }
}
function endGameDlgBtnClick() {
    // console.log("timer stopped");
    clearInterval(document.timerId);
    document.timer.innerHTML = "0 секунд";
    clearGrid();
    newGameAction();
    showEndGameDialog(false);
}
function newGameClicked() {
    // console.log("timer stopped");
    clearInterval(document.timerId);
    document.timer.innerHTML = "0 секунд";
    clearGrid();
    newGameAction();
    menuExit();
}
function infoClicked() {
    menuExit();
    showHelpWindow(true);
}
function hintClicked() {
    // TODO: add check number of empty cells to end game

    var row, col;
    do {
        row = Math.trunc(Math.random() * 8.5);
        col = Math.trunc(Math.random() * 8.5);
    }while (document.gameGrid[row][col].permanent);

    if (document.gameGrid[row][col].displayedValue == null)
        document.numberOfEmptyCells--;

    var elem = document.getElementById("cell-" + (row + 1) + (col + 1));
    elem.className = elem.className.split(' ')[0] + " grid-cell-permanent grid-cell-highlight";
    
    elem.innerHTML = document.gameGrid[row][col].value;
    document.gameGrid[row][col].displayedValue = document.gameGrid[row][col].value;
    document.gameGrid[row][col].permanent = true;
    document.usedHints++;

    elem.removeEventListener("click", cellClicked);
    setTimeout(function(){elem.className = elem.className.split(' ').slice(0, -1).join(' ');}, 1500);
    menuExit(true);
    if (!document.numberOfEmptyCells){
        showEndGameDialog(true);
    }
}
function resetClicked() {
    clearGrid();
    displayGrid();
    document.usedHints = 0;
    document.numberOfEmptyCells = 81 - document.numOfOpenedOnStart;
    menuExit(false);
    // console.log("timer reseted");
    document.timerId = setInterval(secondTick, 1000);
    document.timer.innerHTML = "0 секунд";
    document.gameTime = 0;
}
function removeBtnClicked() {
    // cell - begins from zero !!!
    var cell = document.currentCell;
    document.gameGrid[cell[0]][cell[1]].displayedValue = null;
    document.getElementById("cell-"+(cell[0]+1)+(cell[1]+1)).innerHTML = "";
    selectNumberExit();
    document.numberOfEmptyCells++;
}
function selectNumberClicked(event) {
    // cell - values begins from zero !!!
    var cell = document.currentCell;
    document.gameGrid[cell[0]][cell[1]].displayedValue= +event.currentTarget.innerHTML;
    document.getElementById("cell-"+(cell[0]+1)+(cell[1]+1)).innerHTML=event.currentTarget.innerHTML;
    selectNumberExit();
    document.numberOfEmptyCells--;
    if (!document.numberOfEmptyCells){
        showEndGameDialog(true);
    }
    // TODO: add check for number of empty cell eq with zero to end game
}
function cellClicked(event){
    var id = event.currentTarget.id;
    var indices = [+id.slice(-2, -1) - 1, +id.slice(-1) - 1]
    var possibleNums = checkCell(indices[0], indices[1]);
    if (document.gameGrid[indices[0]][indices[1]].displayedValue)
        document.getElementById("rm-btn").className = "remove-num-btn";
    else{
        if (!possibleNums.length){
            displayError("Нет ходов!", 3);
            return;
        }
        document.getElementById("rm-btn").className = "remove-btn-disabled";
    }
    document.currentCell = indices;

    event.currentTarget.style.background = "#888";

    disableTable(true);
    showBlurLayer(true);
    showSelectBox(true, possibleNums);
    document.blurLayout.addEventListener("click", selectNumberExit);
}
function selectNumberExit() {
    showBlurLayer(false);
    disableTable(false);
    showSelectBox(false);
    document.blurLayout.removeEventListener("click", selectNumberExit);
    var cell = document.currentCell;
    document.getElementById("cell-" + (cell[0] + 1) + (cell[1] + 1)).style.backgroundColor = "";
}

function displayError(msg, sec){
    clearTimeout(document.prevTimeoutId);
    document.getElementById("error-box").innerHTML=msg;
    document.getElementById("error-box").className="";
    document.prevTimeoutId = setTimeout(function(){
        document.getElementById("error-box").className="error-box-disabled";
    }, sec * 1000);
}
function showHelpWindow(display) {
    var dialog = document.getElementById("helpDialog");
    if (display){
        showBlurLayer(true);
        dialog.className = "dialog-box";
        document.blurLayout.addEventListener("click", closeHelpWindow);
    }else{
        dialog.className += " dialog-box-disabled";
        showBlurLayer(false);
    }
}
function closeHelpWindow(display) {
    // console.log("timer resumed");
    document.timerId = setInterval(secondTick, 1000);
    showHelpWindow(false);
    document.blurLayout.removeEventListener("click", closeHelpWindow);
}
function showBlurLayer(display){
    if (display){
        document.blurLayout.className = document.blurLayout.className.split(' ')[0];
    } else {
        document.blurLayout.className += " blur-layer-disabled";
    }
}
function showSelectBox(display, arr) {
    var selectWnd = document.getElementsByClassName("select-number-window")[0];
    if (display){
        selectWnd.className = selectWnd.className.split(' ')[0];

        var angleStep = 360 / arr.length;
        var totalAngle = 0;
        for (var i = 0; i < arr.length; i++){
            var xPos = 46 + 35 * Math.sin(totalAngle * Math.PI / 180),
                 yPos = 42 - 35 * Math.cos(totalAngle * Math.PI / 180);
            totalAngle += angleStep;

            var newElem = document.createElement("div");
            newElem.appendChild(document.createTextNode(arr[i]));
            newElem.className = "select-number-value";
            newElem.style.left = xPos + "%";
            newElem.style.top = yPos + "%";
            newElem.addEventListener("click", selectNumberClicked);
            selectWnd.appendChild(newElem);
        }
    }else{
        selectWnd.className += " select-number-window-disabled";
        while(selectWnd.childNodes.length > 2){
            selectWnd.removeChild(selectWnd.lastChild);
        }
    }
}
function secondTick() { 
    document.gameTime++;
    if (document.gameTime < 60){
        document.timer.innerHTML = document.gameTime + " секунд"; 
    }else{
        document.timer.innerHTML = 
            Math.trunc(document.gameTime / 60) + " минут " +
            (document.gameTime % 60) + " секунд"; 
    }
}
function showEndGameDialog(display) {
    var dialog = document.getElementById("endGameDialog");
    if (display){
        clearInterval(document.timerId);
        // console.log("timer paused");
        showBlurLayer(true);
        dialog.className = dialog.className.split(' ')[0];
        document.getElementById("initialOpenedSpan").innerHTML = document.numOfOpenedOnStart;
        document.getElementById("usedHintsSpan").innerHTML = document.usedHints;
        if (document.gameTime < 60){
            document.getElementById("gameTimeSpan").innerHTML = 
                document.gameTime + " секунд"; 
        }else{
            document.getElementById("gameTimeSpan").innerHTML = 
                Math.trunc(document.gameTime / 60) + " минут " +
                (document.gameTime % 60) + " секунд"; 
    }
    }else{
        showBlurLayer(false);
        dialog.className += " dialog-box-disabled";
    }
}
function disableTable(display){
    var table = document.getElementById("grid");
    if (display){
        table.className += " grid-container-disabled";
    } else {
        table.className = table.className.split(' ')[0];
    }
}
function showMenu(display) {
    var dialog = document.getElementById("menu-list");
    var circle = document.getElementsByClassName("menu-header-circle")[0];
    var menuBox = document.getElementsByClassName("menu-box")[0];
    if (display){
        dialog.className = "";
        circle.className += " menu-header-circle-active";
        menuBox.style.zIndex = "3";
    }else{
        dialog.className += "menu-list-disabled";
        circle.className = circle.className.split(' ')[0];
        menuBox.style.zIndex = "1";

    }
}