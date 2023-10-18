//move to TypeScript
// do not allow trainer to move onto player space
//better mobile layout, 
//some display options that are more obvious
//aditional levels
//multiple trainers to catch
//tutorial
//Also animations
//Make programatic level image generation for random levels
//Make tileTypeEnum
//2
import { Net } from './net';
import { Trainer } from './trainer';
import P5 from 'p5';
import { Actor } from './actor';
import { DisplayData } from './displayData';
const containerElement = document.getElementById('p5-container');
let sketch = function (p) {
    let netObj;
    let trainerObj;
    let trainerSprite;
    let trainerMove;
    let playerObj;
    let playerSprite;
    let gameover;
    let notificationMsg;
    let logText;
    let turnCount;
    let levelImage;
    let displayData;
    let tileNameButton = document.getElementById("tileNameButton");
    const W_SPACE = 0; //Water
    const N_SPACE = 1; //Noisy
    const S_SPACE = 2; //Safe
    const T_SPACE = 3; //Trainer Start
    const B_SPACE = 4; //Bat Start
    const E_SPACE = 5; //Empty
    const level1 = [
        [S_SPACE, B_SPACE, N_SPACE, N_SPACE, W_SPACE, W_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, E_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [W_SPACE, E_SPACE, W_SPACE, E_SPACE, W_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, N_SPACE, E_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, T_SPACE],
    ];
    function preload() {
        console.log("Preloading");
        trainerSprite = p.loadImage('assets/TrainerSpriteSmall.png');
        playerSprite = p.loadImage('assets/ZubatSprite.png');
        levelImage = p.loadImage('assets/ZubatCaveLevel2.png');
    }
    function setup() {
        console.log("Setting Up");
        let width = 600;
        let height = 500;
        let shapeHeight = 48;
        displayData = new DisplayData(false, false, true, 100);
        console.log(displayData);
        gameover = false;
        p.createCanvas(width, height);
        p.background(220);
        logText = "Log";
        notificationMsg = `A trainer is in the cave. Make sure they don't escape without a fight!
  Click a tile to select it. Click again to move there
  After each move, the trainer moves. If they move onto a rocky space, 
  they may give away thier position
  If they move onto water, they will make a splashing noise but 
  it's hard to know which water tile they moved onto`;
        turnCount = 1;
        netObj = new Net(shapeHeight, level1, levelImage);
        trainerObj = new Trainer(netObj.trainerSpawnSpace, trainerSprite, 'assets/TrainerSprite.png');
        trainerObj.visible = false;
        playerObj = new Actor(netObj.playerSpawnSpace, playerSprite, 'assets/ZubatSprite.png');
    }
    function draw() {
        p.background(220);
        let logNote = "";
        if (trainerMove)
            logNote = trainerObj.takeTurn;
        if (logNote != "") {
            addToLog(logNote);
            trainerMove = false;
        }
        printLog();
        printNotification();
        netObj.drw(p, displayData);
    }
    function mouseClicked() {
        if (gameover)
            return;
        let cellClicked = netObj.clickAt(p);
        if (cellClicked != null && cellClicked.type != 5) {
            if (cellClicked.selected) {
                if (netObj.withinTwoMovement(cellClicked, playerObj.tile)) {
                    playerObj.move(cellClicked);
                    if (playerObj.tile == trainerObj.tile) {
                        victory();
                    }
                    else {
                        trainerMove = true;
                    }
                }
                else {
                    setNotificationMsg(`You can only move two spaces at a time. Sorry!`);
                }
                netObj.clearSelected();
            }
            else {
                netObj.clearSelected();
                cellClicked.selected = true;
                trainerMove = false;
            }
        }
        // if(mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        //
        // }
    }
    function showTileNames() {
        displayData.showLabels = !displayData.showLabels;
        if (tileNameButton && displayData.showLabels)
            tileNameButton.innerText = "Hide Tile Names";
        if (tileNameButton && !displayData.showLabels)
            tileNameButton.innerText = "Show Tile Names";
        trainerMove = false;
    }
    function victory() {
        addToLog("win");
        trainerObj.visible = true;
        trainerMove = false;
        gameover = true;
    }
    function defeat() {
        trainerObj.visible = true;
        trainerMove = false;
        gameover = true;
    }
    function printLog() {
        p.textSize(15);
        p.noStroke();
        p.fill(0);
        p.text(logText, 425, 25);
    }
    function printNotification() {
        p.textSize(15);
        p.noStroke();
        p.fill(0);
        p.text(notificationMsg, 15, 380);
    }
    function addToLog(message) {
        logText += `\nTurn ${turnCount}: ` + message;
        turnCount++;
        switch (message) {
            case "Water":
                setNotificationMsg(`You hear some noise in the water!`);
                break;
            case "Escaped":
                setNotificationMsg(`The trainer escaped! Game over :/`);
                defeat();
                break;
            case "Rocky":
                setNotificationMsg(`They've moved onto a rocky space`);
                break;
            case "win":
                setNotificationMsg(`Victory! But who has caught who?`);
                break;
            default:
                setNotificationMsg(`You hear a noise at ${message}!`);
                break;
        }
    }
    function setNotificationMsg(Message) {
        notificationMsg = Message;
    }
};
console.log("F");
//let p5Sketch: P5 = new P5(sketch);
new P5(sketch, containerElement);
