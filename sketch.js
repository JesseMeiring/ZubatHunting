"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var net_js_1 = require("./net.js");
var trainer_js_1 = require("./trainer.js");
var p5_1 = require("p5");
var actor_js_1 = require("./actor.js");
var displayData_js_1 = require("./displayData.js");
var sketch = function (p) {
    var netObj;
    var trainerObj;
    var trainerSprite;
    var trainerMove;
    var playerObj;
    var playerSprite;
    var gameover;
    var notificationMsg;
    var logText;
    var turnCount;
    var levelImage;
    var displayData;
    var tileNameButton = document.getElementById("tileNameButton");
    var W_SPACE = 0; //Water
    var N_SPACE = 1; //Noisy
    var S_SPACE = 2; //Safe
    var T_SPACE = 3; //Trainer Start
    var B_SPACE = 4; //Bat Start
    var E_SPACE = 5; //Empty
    var level1 = [
        [S_SPACE, B_SPACE, N_SPACE, N_SPACE, W_SPACE, W_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, E_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [W_SPACE, E_SPACE, W_SPACE, E_SPACE, W_SPACE, E_SPACE, E_SPACE, N_SPACE],
        [N_SPACE, E_SPACE, N_SPACE, E_SPACE, N_SPACE, N_SPACE, W_SPACE, N_SPACE],
        [N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, N_SPACE, W_SPACE, T_SPACE],
    ];
    function preload() {
        trainerSprite = p.loadImage('assets/TrainerSpriteSmall.png');
        playerSprite = p.loadImage('assets/ZubatSprite.png');
        levelImage = p.loadImage('assets/ZubatCaveLevel2.png');
    }
    function setup() {
        var width = 600;
        var height = 500;
        var shapeHeight = 48;
        displayData = new displayData_js_1.DisplayData(false, false, true, 100);
        console.log(displayData);
        gameover = false;
        p.createCanvas(width, height);
        p.background(220);
        logText = "Log";
        notificationMsg = "A trainer is in the cave. Make sure they don't escape without a fight!\n  Click a tile to select it. Click again to move there\n  After each move, the trainer moves. If they move onto a rocky space, \n  they may give away thier position\n  If they move onto water, they will make a splashing noise but \n  it's hard to know which water tile they moved onto";
        turnCount = 1;
        netObj = new net_js_1.Net(shapeHeight, level1, levelImage);
        trainerObj = new trainer_js_1.Trainer(netObj.trainerSpawnSpace, trainerSprite, 'assets/TrainerSprite.png');
        trainerObj.visible = false;
        playerObj = new actor_js_1.Actor(netObj.playerSpawnSpace, playerSprite, 'assets/ZubatSprite.png');
    }
    function draw() {
        p.background(220);
        var logNote = "";
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
        var cellClicked = netObj.clickAt(p);
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
                    setNotificationMsg("You can only move two spaces at a time. Sorry!");
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
        logText += "\nTurn ".concat(turnCount, ": ") + message;
        turnCount++;
        switch (message) {
            case "Water":
                setNotificationMsg("You hear some noise in the water!");
                break;
            case "Escaped":
                setNotificationMsg("The trainer escaped! Game over :/");
                defeat();
                break;
            case "Rocky":
                setNotificationMsg("They've moved onto a rocky space");
                break;
            case "win":
                setNotificationMsg("Victory! But who has caught who?");
                break;
            default:
                setNotificationMsg("You hear a noise at ".concat(message, "!"));
                break;
        }
    }
    function setNotificationMsg(Message) {
        notificationMsg = Message;
    }
};
var p5Sketch = new p5_1.default(sketch);
