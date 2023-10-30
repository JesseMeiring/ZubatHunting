/// <reference path="../typings/p5-global.d.ts" />
import type p5 from "p5";
import { Image, Renderer } from "p5";

import { Space } from "./space";
import { Actor } from "./actor";
import { Map } from "./map";
import { Trainer } from "./trainer";
import { DisplayData } from "./displayData";
import { spaceTypes } from "./spaceTypes";
import { p5x } from "./sketch";
import { Game } from "./game";
import { appState } from "./stateEnums";

export class DisplayManager {
  width: number = 600;
  height: number = 520;
  shapeHeight: number = 48;
  displayData: DisplayData;
  logText: string = `Log`;
  notificationMsg: string = `A trainer is in the cave. Make sure they don't escape without a fight!
    Click a tile to select it. Click again to move there
    After each move, the trainer moves. If they move onto a rocky space, 
    they may give away thier position
    If they move onto water, they will make a splashing noise but 
    it's hard to know which water tile they moved onto`;
  p5Instance: p5;
  canvas: p5.Renderer;
  verticalDisplay: boolean = false;
  parentElement: HTMLElement;
  state: appState = appState.STATE_PLAYING;
  gameInstance: Game;

  constructor(p: p5, parentElement: HTMLElement) {
    this.p5Instance = p;
    this.displayData = new DisplayData(false, false, false, 100);
    this.canvas = new Renderer(parentElement, p, true);
    this.parentElement = parentElement;
    this.gameInstance = new Game(this.p5Instance, parentElement);
  }

  intializeCanvas(p: p5) {
    this.canvas = p.createCanvas(this.width, this.height);
    this.resizeToWindow(this.gameInstance);

    // Move the canvas so it’s inside our <div id="canvas">.
    this.canvas.parent("canvas");

    p.background(220);
  }

  setupGame(gameInstance: Game) {
    this.gameInstance;
  }

  resizeToWindow(gameInstance: Game) {
    if (this.p5Instance.windowWidth >= 600) {
      this.width = 600;
      this.verticalDisplay = false;
    } else {
      this.width = gameInstance.mapObj.sprite.width;
      this.verticalDisplay = true;
    }
    this.p5Instance.resizeCanvas(this.width, this.height);
  }

  drw(gameInstance: Game) {
    this.resizeToWindow(gameInstance);
    this.p5Instance.background(220);

    let logNote = "";
    if (gameInstance.trainerMove) logNote = gameInstance.trainerObj.takeTurn;
    if (logNote != "") {
      this.addToLog(logNote);
      gameInstance.trainerMove = false;
    }
    this.printLog();
    this.printNotification();
    gameInstance.mapObj.drw(this.p5Instance, this.displayData);
  }

  mousePressed() {
    let mx = this.p5Instance.mouseX;
    let my = this.p5Instance.mouseY;
    if (this.state === appState.STATE_PLAYING) {
      this.gameInstance.mapPressed(this.p5Instance);
    } else if (this.state === appState.STATE_MAINMENU) {
    }
  }

  gameEnd(victory: boolean) {
    if (victory) this.addToLog("win");
    this.state = appState.STATE_GAMEOVER;
  }

  addToLog(message: string) {
    this.logText += `\nTurn ${this.gameInstance.turnCount}: ` + message;
    this.gameInstance.turnCount++;
    switch (message) {
      case "Water":
        this.notificationMsg = `You hear some noise in the water!`;
        break;
      case "Escaped":
        this.notificationMsg = `The trainer escaped! Game over 😢`;
        this.gameEnd(false);
        break;
      case "Rocky":
        this.notificationMsg = `They've moved onto a rocky space`;
        break;
      case "win":
        this.notificationMsg = `🎉 Victory! 🎉 But who has caught who?`;
        break;
      default:
        this.notificationMsg = `You hear a noise at ${message}!`;
        break;
    }
    let lines = this.logText.split("\n");
    if (lines.length > 8) lines.splice(1, 1);
    this.logText = lines.join("\n");
  }

  printLog() {
    this.p5Instance.noStroke();
    this.p5Instance.fill(0);
    if (this.verticalDisplay) {
      this.p5Instance.textSize(12);
      let NotifiationAndLog = this.logText + "\n" + this.notificationMsg;
      this.p5Instance.text(NotifiationAndLog, 15, 380);
    } else {
      this.p5Instance.textSize(15);
      this.p5Instance.text(this.logText, 425, 25);
    }
  }

  printNotification() {
    this.p5Instance.textSize(15);
    this.p5Instance.noStroke();
    this.p5Instance.fill(0);
    if (this.verticalDisplay) {
      // this.p5Instance.textSize(12);
      // this.p5Instance.text(this.notificationMsg, 15, 380);
    } else {
      this.p5Instance.textSize(15);
      this.p5Instance.text(this.notificationMsg, 15, 380);
    }
  }

  showTileNames() {
    this.displayData.showLabels = !this.displayData.showLabels;
    // if(tileNameButton && displayData.showLabels) tileNameButton.innerText = "Hide Tile Names"
    // if(tileNameButton && !displayData.showLabels) tileNameButton.innerText = "Show Tile Names"
  }
}
