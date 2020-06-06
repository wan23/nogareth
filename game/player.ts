import { Thing } from "./thing";
import { BOB, BOBAPI } from "./bob";
import { Level } from "./level";
import { CONSTANTS, INPUTCONTROLLER, GAME } from "./data";

export class Player extends Thing {
    hasRedKey: boolean;
    hasGreenKey: boolean;
    hasBlueKey: boolean;

    constructor(xt: number, yt: number, bobt: BOB, l: Level) {
        super(xt, yt, bobt, l);
        this.type_id = CONSTANTS.GameType.PLAYER;
        this.height = 20;
        this.width = 26;
        this.speed = 4;
        this.animationSpeed = 2;
        this.hasRedKey = false;
        this.hasGreenKey = false;
        this.hasBlueKey = false;
    }

    draw() {
        //Player is the only Thing which doesn't call defaultDraw() because
        //he is always at 320,240. I made his Y 220 to counter for his bounding
        //box being half his height. Everything else should set up thir draw()
        //methods the same way except instead of calling Draw_BOB16, they should
        //call defaultDraw(), so that they get drawn in world-relation to the player
        this.processAnimation();
        BOBAPI.Draw_BOB16(this.bob);
    }

    update() {

        if (this.state == CONSTANTS.ThingState.FALLING)
            return;
        //reset vectors
        this.vx = 0;
        this.vy = 0;
        this.velocity = 0;



        //process user input and set up angles.
        //For enemies, this is done using doAI()
        if (INPUTCONTROLLER.Key_Down) {
            this.angle = 180;
            this.velocity = this.speed;
        }
        if (INPUTCONTROLLER.Key_Up) {
            this.angle = 0;
            this.velocity = this.speed;
        }
        if (INPUTCONTROLLER.Key_Left) {
            if (INPUTCONTROLLER.Key_Up)
                this.angle = 315;
            else if (INPUTCONTROLLER.Key_Down)
                this.angle = 225;
            else
                this.angle = 270;
            this.velocity = this.speed;
        }
        if (INPUTCONTROLLER.Key_Right) {
            if (INPUTCONTROLLER.Key_Up)
                this.angle = 45;
            else if (INPUTCONTROLLER.Key_Down)
                this.angle = 135;
            else
                this.angle = 90;
            this.velocity = this.speed;
        }
        //CHEATS
        if (INPUTCONTROLLER.KEY_PRESS=="1") {
            this.hasRedKey = true;
            this.hasGreenKey = true;
            this.hasBlueKey = true;

        }
        if (INPUTCONTROLLER.KEY_PRESS=="2") {
            GAME.load_level("levels\\mikeslevel.txt");
            this.x = 13 * 40;
            this.y = 26 * 40;
        }
        if (INPUTCONTROLLER.KEY_PRESS=="3") {
            GAME.load_level("levels\\juanlevel.txt");
            this.x = 12 * 40;
            this.y = 11 * 40;
        }
        if (INPUTCONTROLLER.KEY_PRESS=="4") {
            GAME.load_level("levels\\neallevel.txt");
            this.x = 95 * 40;
            this.y = 95 * 40;
        }
        if (INPUTCONTROLLER.KEY_PRESS=="5") {
            this.health = 10000000;
        }
        if (INPUTCONTROLLER.KEY_PRESS=="6") {
            this.speed = 15;
        }
        if (INPUTCONTROLLER.KEY_PRESS=="7") {
            this.speed = 4;
        }

        //Set up vx and vy. This method does it automatically using
        //velocity and angle.
        this.getComponents();
    }

    move() {
        if (this.state == CONSTANTS.ThingState.FALLING)
            return;
        //move the player's X
        this.x = this.x + this.round(this.vx);
        //set movingX to true. This tells handleCollision whether we are currently
        //moving the player's X or Y. It needs to know this information in order to
        //take apropriate action
        this.movingX = true;

        //Do collission detection with tiles
        this.checkCorners(CONSTANTS.GameType.TILE);

        //do collission detection with tiles
        for (let i = 0; i < this.currentLevel.objectSize; i++) {
            if (this.checkCollision(this.currentLevel.objectArray[i]) > 0) {
                this.currentLevel.objectArray[i].handleCollision(this);
                this.handleCollision(this.currentLevel.objectArray[i]);
            }
        }

        //do collission detection with enemies
        for (let i = 0; i < this.currentLevel.enemySize; i++) {
            if (this.checkCollision(this.currentLevel.enemyArray[i]) > 0) {
                this.currentLevel.enemyArray[i].handleCollision(this);
                this.handleCollision(this.currentLevel.enemyArray[i]);
            }
        }

        //set movingX to false, because we are done moving the player's X
        this.movingX = false;

        //Now do the same process for Y
        this.y = this.y + this.round(this.vy);
        this.movingY = true;
        this.checkCorners(CONSTANTS.GameType.TILE);
        for (let i = 0; i < this.currentLevel.objectSize; i++) {
            if (this.checkCollision(this.currentLevel.objectArray[i]) > 0) {
                this.currentLevel.objectArray[i].handleCollision(this);
                this.handleCollision(this.currentLevel.objectArray[i]);
            }
        }
        for (let i = 0; i < this.currentLevel.enemySize; i++) {
            if (this.checkCollision(this.currentLevel.enemyArray[i]) > 0) {
                this.currentLevel.enemyArray[i].handleCollision(this);
                this.handleCollision(this.currentLevel.enemyArray[i]);
            }
        }
        this.movingY = false;

    }


    //figure out what frame of animation to use, and set it to currentFrame.
    processAnimation() {
        if (this.state == CONSTANTS.ThingState.FALLING) {
            if (this.animationCounter < 15)
                this.currentFrame = 12;
            if (this.animationCounter >= 15 && this.animationCounter < 30)
                this.currentFrame = 13;
            if (this.animationCounter >= 30 && this.animationCounter < 45)
                this.currentFrame = 14;
            if (this.animationCounter >= 45) {
                this.alive = false;
            }
        }
        //set the frame based on angle
        if (this.state == CONSTANTS.ThingState.NORMAL) {
            if (this.velocity == 0)
                this.animationFlipper = 0;
            if (this.angle >= 0 && this.angle < 90) {
                this.currentFrame = 9 + this.animationFlipper;
            }
            if (this.angle >= 90 && this.angle < 180) {
                this.currentFrame = 3 + this.animationFlipper;
            }
            if (this.angle >= 180 && this.angle < 270) {
                this.currentFrame = 0 + this.animationFlipper;
            }
            if (this.angle >= 270 && this.angle < 360) {
                this.currentFrame = 6 + this.animationFlipper;
            }
            /*
            animationCounter is a generic counter. when it reaches animationSpeed, it
            resets, and increments animationFlipper which is the offset to the current frame
            based on the direction the character is facing
            */
            if (this.animationCounter == this.animationSpeed) {
                this.animationFlipper++;
                this.animationCounter = 0;
                if (this.animationFlipper > 2)
                    this.animationFlipper = 0;
            }
        }
        this.animationCounter++;
        this.bob.curr_frame = this.currentFrame;
        this.bob.x = 320;
        this.bob.y = 220;
    }

    checkCorners(thing: number) {
        if (this.x <= 0 || this.y <= 0 || this.x + this.width - 1 >= this.currentLevel.width * 40
            || this.y + this.height - 1 >= this.currentLevel.height * 40)
            return;
        if (thing == CONSTANTS.GameType.TILE) {
            //if checkCollision returned true, run both handleCollisions
            if (this.checkCollision(this.currentLevel.getTileObject(this.x, this.y)) > 0) {
                this.currentLevel.getTileObject(this.x, this.y).handleCollision(this);
                this.handleCollision(this.currentLevel.getTileObject(this.x, this.y));
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y)) > 0) {
                this.currentLevel.getTileObject(this.x + this.width - 1, this.y).handleCollision(this);
                this.handleCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y));
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1)) > 0) {
                this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1).handleCollision(this);
                this.handleCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1));
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x, this.y + this.height - 1)) > 0) {
                this.currentLevel.getTileObject(this.x, this.y + this.height - 1).handleCollision(this);
                this.handleCollision(this.currentLevel.getTileObject(this.x, this.y + this.height - 1));
            }
        }

    }

    //prevent player hurt sound playing every frame
    hurtDelay:Date = new Date();

    hurt(h: number) {

        let currentTime = new Date();
        let timeDiff = currentTime.getTime()-this.hurtDelay.getTime();
        if (timeDiff>100){
            BOBAPI.DSound_Play(1);
            this.hurtDelay = new Date();
        }
        this.health -= h;
    }


    bounce(thing:Thing) {
        let bounceAmount = 19;
        if (this.state == CONSTANTS.ThingState.FALLING)
            return;

        let tempvx = bounceAmount;
        let tempvy = bounceAmount;
        if (this.x < thing.x)
            tempvx = -bounceAmount;
        if (this.y < thing.y)
            tempvy = -bounceAmount;

        this.x = this.x + tempvx;
        this.movingX = true;
        this.checkCorners(CONSTANTS.GameType.TILE);
        this.movingX = false;
        this.y = this.y + tempvy;
        this.movingY = true;
        this.checkCorners(CONSTANTS.GameType.TILE);
        this.movingY = false;
    }
}