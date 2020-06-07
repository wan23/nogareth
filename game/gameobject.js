define(["require", "exports", "./bob", "./thing", "./data"], function (require, exports, bob_1, thing_1, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameObject = void 0;
    //port of Object.cpp, can't use Object because name is used in JavaScript
    class GameObject extends thing_1.Thing {
        constructor(xt, yt, objID, bob, l) {
            super(xt, yt, bob, l);
            this.type_id = data_1.CONSTANTS.GameType.OBJECT;
            this.objectID = objID;
            if (0 <= this.objectID && this.objectID <= 2) {
                this.currentFrame = objID;
                if (this.objectID == 0)
                    this.objectType = data_1.CONSTANTS.ObjectType.REDKEY;
                if (this.objectID == 1)
                    this.objectType = data_1.CONSTANTS.ObjectType.BLUEKEY;
                if (this.objectID == 2)
                    this.objectType = data_1.CONSTANTS.ObjectType.GREENKEY;
                this.height = 15;
                this.width = 7;
                this.speed = 0;
                this.x = this.x + 18;
                this.y = this.y + 14;
            }
            if (3 <= this.objectID && this.objectID <= 6) {
                this.currentFrame = objID;
                this.objectType = data_1.CONSTANTS.ObjectType.GREENDOOR;
                this.height = 40;
                this.width = 40;
            }
            if (7 <= this.objectID && this.objectID <= 10) {
                this.currentFrame = objID;
                this.objectType = data_1.CONSTANTS.ObjectType.BLUEDOOR;
                this.height = 40;
                this.width = 40;
            }
            if (11 <= this.objectID && this.objectID <= 14) {
                this.currentFrame = objID;
                this.objectType = data_1.CONSTANTS.ObjectType.REDDOOR;
                this.height = 40;
                this.width = 40;
            }
        }
        draw() {
            this.processAnimation();
            this.defaultDraw();
        }
        update() {
            //reset vectors
            this.vx = 0;
            this.vy = 0;
            this.velocity = this.speed;
            this.getComponents();
        }
        move() {
            this.x = this.x + this.vx;
            this.movingX = true;
            //checkCorners(TILE);
            this.movingX = false;
            this.y = this.y + this.vy;
            this.movingY = true;
            //checkCorners(TILE);
            this.movingY = false;
        }
        //figure out what frame of animation to use, and set it to currentFrame.
        processAnimation() {
            if (0 <= this.objectID && this.objectID <= 2) {
                this.currentFrame = this.objectID;
                this.bob.x = this.x - 18;
                this.bob.y = this.y - 14;
            }
            if (3 <= this.objectID && this.objectID <= 14) {
                this.currentFrame = this.objectID;
                this.bob.x = this.x;
                this.bob.y = this.y;
            }
            this.bob.curr_frame = this.currentFrame;
        }
        checkCorners(thing) {
            if (this.x <= 0 || this.y <= 0 || this.x + this.width - 1 >=
                this.currentLevel.width * 40 || this.y + this.height - 1 >= this.currentLevel.height * 40)
                return;
            if (thing == data_1.CONSTANTS.GameType.TILE) {
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
        handleCollision(thing) {
            if (thing.type_id == data_1.CONSTANTS.GameType.PLAYER) {
                if (this.objectType == data_1.CONSTANTS.ObjectType.REDKEY || this.objectType == data_1.CONSTANTS.ObjectType.BLUEKEY
                    || this.objectType == data_1.CONSTANTS.ObjectType.GREENKEY) {
                    this.alive = false;
                    if (this.objectType == data_1.CONSTANTS.ObjectType.REDKEY)
                        this.currentLevel.player.hasRedKey = true;
                    if (this.objectType == data_1.CONSTANTS.ObjectType.GREENKEY)
                        this.currentLevel.player.hasGreenKey = true;
                    if (this.objectType == data_1.CONSTANTS.ObjectType.BLUEKEY)
                        this.currentLevel.player.hasBlueKey = true;
                    bob_1.BOBAPI.DSound_Play(11);
                }
                if (this.objectType == data_1.CONSTANTS.ObjectType.REDDOOR || this.objectType == data_1.CONSTANTS.ObjectType.GREENDOOR
                    || this.objectType == data_1.CONSTANTS.ObjectType.BLUEDOOR) {
                    if (this.objectType == data_1.CONSTANTS.ObjectType.REDDOOR) {
                        if (this.currentLevel.player.hasRedKey) {
                            this.alive = false;
                            bob_1.BOBAPI.DSound_Play(6);
                        }
                    }
                    if (this.objectType == data_1.CONSTANTS.ObjectType.BLUEDOOR) {
                        if (this.currentLevel.player.hasBlueKey) {
                            this.alive = false;
                            bob_1.BOBAPI.DSound_Play(6);
                        }
                    }
                    if (this.objectType == data_1.CONSTANTS.ObjectType.GREENDOOR) {
                        if (this.currentLevel.player.hasGreenKey) {
                            this.alive = false;
                            bob_1.BOBAPI.DSound_Play(6);
                        }
                    }
                    if (thing.movingX) {
                        this.moveToEdgeX(thing, this);
                    }
                    else {
                        this.moveToEdgeY(thing, this);
                    }
                }
            }
            this.defaultHandleCollision(thing);
        }
        defaultHandleCollision(thing) {
        }
    }
    exports.GameObject = GameObject;
});
//# sourceMappingURL=gameobject.js.map