import { BOB, BOBAPI } from "./bob";
import { Level } from "./level";
import { Thing } from "./thing";
import { CONSTANTS, GetRandom } from "./data";
import { Tile } from "./tile";
import { GameObject } from "./gameobject";

export class Enemy extends Thing {
    enemyID: number;

    constructor(xt: number, yt: number, enID: number, bob: BOB, l: Level) {
        super(xt, yt, bob, l);
        this.type_id = CONSTANTS.GameType.ENEMY;
        this.enemyID = enID;
        if (this.enemyID == CONSTANTS.EnemyType.GreyZombie) {
            this.height = 20;
            this.width = 30;
            this.speed = 2;
            this.animationSpeed = 4;
            this.y = this.y + 20;
            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
        }
        if (this.enemyID == CONSTANTS.EnemyType.RedZombie) {
            this.height = 20;
            this.width = 30;
            this.speed = 2;
            this.animationSpeed = 2;
            this.y = this.y + 20;
            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
        }
        if (this.enemyID == CONSTANTS.EnemyType.Sluggo) {
            this.height = 16;
            this.width = 16;
            this.speed = .5;
            this.animationSpeed = 3;
            this.x = this.x + 7;
            this.y = this.y + 19;
            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
        }
    }

    draw() {
        this.processAnimation();
        this.defaultDraw();
    }

    update() {
        if (this.state == CONSTANTS.ThingState.FALLING)
            return;

        //reset vectors
        this.vx = 0;
        this.vy = 0;
        this.doAI();
        this.getComponents();

    }

    move() {
        if (this.state == CONSTANTS.ThingState.FALLING)
            return;

        this.x = this.x + this.vx;

        this.movingX = true;
        this.checkCorners(CONSTANTS.GameType.TILE);
        //do collission detection with objects
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
        this.movingX = false;

        this.y = this.y + this.vy;

        this.movingY = true;
        this.checkCorners(CONSTANTS.GameType.TILE);
        //do collission detection with objects
        for (let i = 0; i < this.currentLevel.objectSize; i++) {
            if (this.checkCollision(this.currentLevel.objectArray[i]) > 0) {
                this.currentLevel.objectArray[i].handleCollision(this);
                this.handleCollision(this.currentLevel.objectArray[i]);
            }
        }
        for (let i = 0; i < this.currentLevel.enemySize; i++) {
            if (this.checkCollision(this.currentLevel.enemyArray[i]) > 0) {
                //currentLevel->enemyArray[i].handleCollision(*this);
                this.handleCollision(this.currentLevel.enemyArray[i]);
            }
        }
        this.movingY = false;

    }


    //figure out what frame of animation to use, and set it to currentFrame.
    processAnimation() {

        if (this.enemyID == CONSTANTS.EnemyType.GreyZombie || this.enemyID == CONSTANTS.EnemyType.RedZombie) {
            if (this.state == CONSTANTS.ThingState.FALLING) {
                if (this.animationCounter < 15)
                    this.currentFrame = 12;
                if (this.animationCounter >= 15 && this.animationCounter < 30)
                    this.currentFrame = 13;
                if (this.animationCounter >= 30 && this.animationCounter < 45)
                    this.currentFrame = 14;
                if (this.animationCounter >= 45)
                    this.alive = false;
            }
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
                if (this.animationCounter >= this.animationSpeed) {
                    this.animationFlipper++;
                    this.animationCounter = 0;
                    if (this.animationFlipper > 2)
                        this.animationFlipper = 0;
                }
            }
            this.animationCounter++;
            this.bob.x = this.x;
            this.bob.y = this.y - 20;
        }
        if (this.enemyID == CONSTANTS.EnemyType.Sluggo) {
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
                if (this.animationCounter >= this.animationSpeed) {
                    this.animationFlipper++;
                    this.animationCounter = 0;
                    if (this.animationFlipper > 2)
                        this.animationFlipper = 0;
                }
            }
            if (this.state == CONSTANTS.ThingState.FALLING) {
                this.alive = false;
            }
            this.animationCounter++;
            this.bob.x = this.x - 7;
            this.bob.y = this.y - 19;
        }
        this.bob.curr_frame = this.currentFrame;

    }

    checkCorners(thing: number) {
        if (this.x <= 0 || this.y <= 0 || this.x + this.width - 1 >= this.currentLevel.width * 40 || this.y + this.height - 1 >= this.currentLevel.height * 40)
            return;
        if (thing == CONSTANTS.GameType.TILE) {
            //if checkCollision returned true, run both handleCollisions
            if (this.checkCollision(this.currentLevel.getTileObject(this.x, this.y)) > 0) {
                this.handleCollision(this.currentLevel.getTileObject(this.x, this.y));
                this.currentLevel.getTileObject(this.x, this.y).handleCollision(this);
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y)) > 0) {
                this.handleCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y));
                this.currentLevel.getTileObject(this.x + this.width - 1, this.y).handleCollision(this);
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1)) > 0) {
                this.handleCollision(this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1));
                this.currentLevel.getTileObject(this.x + this.width - 1, this.y + this.height - 1).handleCollision(this);
            }
            if (this.checkCollision(this.currentLevel.getTileObject(this.x, this.y + this.height - 1)) > 0) {
                this.handleCollision(this.currentLevel.getTileObject(this.x, this.y + this.height - 1));
                this.currentLevel.getTileObject(this.x, this.y + this.height - 1).handleCollision(this);
            }
        }

    }

    handleCollision(thing: Thing) {
        if (this == thing)
            return;
        if (this.enemyID == CONSTANTS.EnemyType.GreyZombie) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
                        }
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                        }
                        if (thing.type_id == CONSTANTS.GameType.TILE) {

                            let tempTile: Tile = thing as Tile;
                            if (tempTile.tileType == CONSTANTS.TileType.Wall) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                            }

                        }
                        if (thing.type_id == CONSTANTS.GameType.OBJECT) {
                            let tempObject = thing as GameObject;
                            if (tempObject.objectType == CONSTANTS.ObjectType.REDDOOR || tempObject.objectType == CONSTANTS.ObjectType.GREENDOOR || tempObject.objectType == CONSTANTS.ObjectType.BLUEDOOR) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }

                        }
                        if (thing.type_id == CONSTANTS.GameType.ENEMY) {
                            this.angle += 180;
                            if (this.angle >= 360)
                                this.angle -= 360;
                        }
                        break;
                    }
                case CONSTANTS.AiMode.SeekPlayer:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                        }
                        if (thing.type_id == CONSTANTS.GameType.OBJECT) {
                            let tempObject = thing as GameObject;
                            if (tempObject.objectType == CONSTANTS.ObjectType.REDDOOR || tempObject.objectType == CONSTANTS.ObjectType.GREENDOOR || tempObject.objectType == CONSTANTS.ObjectType.BLUEDOOR) {
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }

                        }

                    }
            }

        }

        if (this.enemyID == CONSTANTS.EnemyType.RedZombie) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
                        }
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                        }
                        if (thing.type_id == CONSTANTS.GameType.TILE) {
                            let tempTile: Tile = thing as Tile;
                            if (tempTile.tileType == CONSTANTS.TileType.Wall || tempTile.tileType == CONSTANTS.TileType.Hole) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }

                        }
                        if (thing.type_id == CONSTANTS.GameType.OBJECT) {
                            let tempObject = thing as GameObject;
                            if (tempObject.objectType == CONSTANTS.ObjectType.REDDOOR || tempObject.objectType == CONSTANTS.ObjectType.GREENDOOR || tempObject.objectType == CONSTANTS.ObjectType.BLUEDOOR) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }
                        }
                        if (thing.type_id == CONSTANTS.GameType.ENEMY) {
                            this.angle += 180;
                            if (this.angle >= 360)
                                this.angle -= 360;
                        }
                        break;
                    }
                case CONSTANTS.AiMode.SeekPlayer:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                        }
                        if (thing.type_id == CONSTANTS.GameType.TILE) {
                            let tempTile = thing as Tile;
                            if (tempTile.tileType == CONSTANTS.TileType.Hole) {
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }

                        }
                        if (thing.type_id == CONSTANTS.GameType.OBJECT) {
                            let tempObject = thing as GameObject;
                            if (tempObject.objectType == CONSTANTS.ObjectType.REDDOOR || tempObject.objectType == CONSTANTS.ObjectType.GREENDOOR || tempObject.objectType == CONSTANTS.ObjectType.BLUEDOOR) {
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }
                        }
                    }
            }

        }
        if (this.enemyID == CONSTANTS.EnemyType.Sluggo) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(25);
                            this.currentLevel.player.bounce(this);
                            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
                        }
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        if (thing.type_id == CONSTANTS.GameType.PLAYER) {
                            this.currentLevel.player.hurt(10);
                            this.currentLevel.player.bounce(this);
                        }
                        if (thing.type_id == CONSTANTS.GameType.TILE) {
                            let tempTile: Tile = thing as Tile;
                            if (tempTile.tileType == CONSTANTS.TileType.Wall || tempTile.tileType == CONSTANTS.TileType.Hole) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }

                        }
                        if (thing.type_id == CONSTANTS.GameType.OBJECT) {
                            let tempObject = thing as GameObject;
                            if (tempObject.objectType == CONSTANTS.ObjectType.REDDOOR || tempObject.objectType == CONSTANTS.ObjectType.GREENDOOR || tempObject.objectType == CONSTANTS.ObjectType.BLUEDOOR) {
                                this.angle = 90;
                                let temp = GetRandom(4);
                                if (temp == 0)
                                    this.angle = 0;
                                if (temp == 1)
                                    this.angle = 90;
                                if (temp == 2)
                                    this.angle = 180;
                                if (temp == 3)
                                    this.angle = 270;
                                if (this.movingX) {
                                    this.moveToEdgeX(this, thing);
                                }
                                else {
                                    this.moveToEdgeY(this, thing);
                                }
                            }
                        }
                        if (thing.type_id == CONSTANTS.GameType.ENEMY) {
                            this.angle += 180;
                            if (this.angle >= 360)
                                this.angle -= 360;
                        }
                        break;
                    }
            }

        }

        this.defaultHandleCollision(thing);
    }

    defaultHandleCollision(thing: Thing) {

        if (thing.type_id == CONSTANTS.GameType.ENEMY) {
            if (this.movingX) {
                this.moveToEdgeX(this, thing);
            }
            else {
                this.moveToEdgeY(this, thing);
            }
        }

    }

    doAI() {
        if (this.enemyID == CONSTANTS.EnemyType.GreyZombie) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        this.velocity = 0;
                        this.animationSpeed = 4;
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        this.velocity = this.speed;
                        this.animationSpeed = 4;
                        if (this.getDistance(this.currentLevel.player) < 180) {
                            this.AI_mode = CONSTANTS.AiMode.SeekPlayer;
                            BOBAPI.DSound_Play(5);
                        }
                        break;
                    }
                case CONSTANTS.AiMode.SeekPlayer:
                    {
                        this.angle = this.getAngle(this.currentLevel.player.x, this.currentLevel.player.y);
                        this.velocity = this.speed + 1;
                        this.animationSpeed = 2;
                        if (this.getDistance(this.currentLevel.player) > 300) {
                            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
                            BOBAPI.DSound_Play(10);
                        }
                        break;
                    }
            }
        }
        if (this.enemyID == CONSTANTS.EnemyType.RedZombie) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        this.velocity = 0;
                        this.animationSpeed = 4;
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        this.velocity = this.speed;
                        this.animationSpeed = 4;
                        if (this.getDistance(this.currentLevel.player) < 180) {
                            this.AI_mode = CONSTANTS.AiMode.SeekPlayer;
                            BOBAPI.DSound_Play(5);
                        }
                        break;
                    }
                case CONSTANTS.AiMode.SeekPlayer:
                    {
                        this.angle = this.getAngle(this.currentLevel.player.x, this.currentLevel.player.y);
                        this.velocity = this.speed + 2;
                        this.animationSpeed = 1;
                        if (this.getDistance(this.currentLevel.player) > 300) {
                            this.AI_mode = CONSTANTS.AiMode.DumbWalk;
                            BOBAPI.DSound_Play(10);
                        }
                        break;
                    }
            }
        }
        if (this.enemyID == CONSTANTS.EnemyType.Sluggo) {
            switch (this.AI_mode) {
                case CONSTANTS.AiMode.Sleep:
                    {
                        this.velocity = 0;
                        this.animationSpeed = 3;
                        break;
                    }
                case CONSTANTS.AiMode.DumbWalk:
                    {
                        this.velocity = this.speed;
                        this.animationSpeed = 3;
                        break;
                    }
            }
        }
    }

    hurt(h: number) {
        this.health -= h;
        if (this.health <= 0)
            this.alive = false;
    }

    getDistance(thing: Thing) {
        return Math.sqrt(Math.pow((this.x - thing.x), 2) + Math.pow((this.y - thing.y), 2));
    }

}