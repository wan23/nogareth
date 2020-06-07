define(["require", "exports", "./bob", "./thing", "./data"], function (require, exports, bob_1, thing_1, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.jump_if_not_equal_instr = exports.jump_if_equal_instr = exports.jump_instr = exports.lights_instr = exports.restore_health_instr = exports.win_game_instr = exports.toggle_state_instr = exports.text_box_instr = exports.teleport_instr = exports.play_music_instr = exports.play_sound_instr = exports.load_level_instr = exports.set_state_temp_instr = exports.set_state_instr = exports.instr = exports.Tile = void 0;
    class Tile extends thing_1.Thing {
        constructor(x, y, t, bob, l) {
            super(x, y, bob, l);
            this.tileID = t;
            this.type_id = data_1.CONSTANTS.GameType.TILE;
            this.height = data_1.CONSTANTS.TileHeight;
            this.width = data_1.CONSTANTS.TileWidth;
            if (this.tileID < 104)
                this.tileType = data_1.CONSTANTS.TileType.Wall;
            if (this.tileID >= 104 && this.tileID < 132)
                this.tileType = data_1.CONSTANTS.TileType.Floor;
            if ((this.tileID >= 132 && this.tileID < 136) || this.tileID == 138)
                this.tileType = data_1.CONSTANTS.TileType.Hole;
            if (this.tileID == 137) {
                this.tileType = data_1.CONSTANTS.TileType.Spike;
                this.state = data_1.CONSTANTS.TileState.Up;
            }
            if (this.tileID == 136) {
                this.tileType = data_1.CONSTANTS.TileType.Spike;
            }
            this.state = data_1.CONSTANTS.TileState.Down;
            this.scriptLoaded = false;
            this.scriptNeedsReset = false;
            this.script = [];
        }
        draw() {
            this.processAnimation();
            this.defaultDraw();
        }
        processAnimation() {
            this.currentFrame = this.tileID;
            this.bob.curr_frame = this.currentFrame;
            this.bob.x = this.x;
            this.bob.y = this.y;
        }
        //handleCollision will process the script language, and then
        //call defaultHandleCollision if needed.
        handleCollision(thing) {
            if (thing.type_id == data_1.CONSTANTS.GameType.PLAYER) {
                if (this.scriptLoaded == true && this.scriptNeedsReset == false) {
                    this.processScript(thing);
                }
            }
            // If you're on a script don't process
            if (!this.scriptNeedsReset) {
                this.defaultHandleCollision(thing);
            }
        }
        defaultHandleCollision(thing) {
            //if the thing it collided with was a PLAYER
            if (thing.type_id == data_1.CONSTANTS.GameType.PLAYER || thing.type_id == data_1.CONSTANTS.GameType.ENEMY) {
                //if this tile is a WALL
                if (this.tileType == data_1.CONSTANTS.TileType.Wall) {
                    //if the player is currently moving horizontally,
                    //move him to the edge of this tile.
                    if (thing.movingX) {
                        this.moveToEdgeX(thing, this);
                    }
                    else {
                        this.moveToEdgeY(thing, this);
                    }
                }
                else if (this.tileType == data_1.CONSTANTS.TileType.Hole) {
                    //thing.state=FALLING;
                    if (this.currentLevel.getTileObject(thing.x, thing.y).tileType == data_1.CONSTANTS.TileType.Hole
                        && this.currentLevel.getTileObject(thing.x + thing.width - 1, thing.y).tileType == data_1.CONSTANTS.TileType.Hole
                        && this.currentLevel.getTileObject(thing.x + thing.width - 1, thing.y + thing.height - 1).tileType == data_1.CONSTANTS.TileType.Hole
                        && this.currentLevel.getTileObject(thing.x, thing.y + thing.height - 1).tileType == data_1.CONSTANTS.TileType.Hole) {
                        thing.state = data_1.CONSTANTS.ThingState.FALLING;
                        thing.animationCounter = 0;
                        if (thing.type_id == data_1.CONSTANTS.GameType.PLAYER)
                            bob_1.BOBAPI.DSound_Play(4);
                        if (thing.type_id == data_1.CONSTANTS.GameType.ENEMY) {
                            var tempEnemy = thing;
                            // TODO: Should this include red zombies? In the original game it didn't but looks like a bug
                            if (tempEnemy.enemyID == data_1.CONSTANTS.EnemyType.GreyZombie) {
                                if (this.getDistance(thing) < 350)
                                    bob_1.BOBAPI.DSound_Play(9);
                            }
                        }
                    }
                }
                else if (this.tileType == data_1.CONSTANTS.TileType.Spike) {
                    if (this.state == data_1.CONSTANTS.TileState.Up) {
                        thing.hurt(1);
                        // if (thing.type_id==CONSTANTS.GameType.PLAYER)
                        //     BOBAPI.DSound_Play(1);
                    }
                }
            }
        }
        updateState() {
            // hard code special tiles (Thanks Neal!)
            // what the? its not my fault you BABAR
            // spike
            if (this.tileType == data_1.CONSTANTS.TileType.Spike) {
                if (this.stateChanged) {
                    if (this.state == data_1.CONSTANTS.TileState.On) {
                        this.toggleTime = 150;
                        this.stateChangeTimer = this.toggleTime;
                        this.state = data_1.CONSTANTS.TileState.Up;
                        this.nextState = data_1.CONSTANTS.TileState.Down;
                    }
                    else if (this.state == data_1.CONSTANTS.TileState.Up) {
                        // set the tileid and that it kills things
                        this.tileID = 137;
                    }
                    else if (this.state == data_1.CONSTANTS.TileState.Down) {
                        // set the tileid and that it doesn't kill things
                        this.tileID = 136;
                    }
                    this.stateChanged = false;
                }
            }
            else if (this.tileID >= 96 && this.tileID < 100) {
                if (this.stateChanged && this.state == data_1.CONSTANTS.TileState.Off) {
                    bob_1.BOBAPI.DSound_Play(7);
                    this.tileID += 4;
                    this.stateChanged = false;
                    this.tileType = data_1.CONSTANTS.TileType.Wall;
                }
            }
            else if (this.tileID >= 100 && this.tileID < 104) {
                if (this.stateChanged && this.state == data_1.CONSTANTS.TileState.On) {
                    bob_1.BOBAPI.DSound_Play(7);
                    this.tileID -= 4;
                    this.stateChanged = false;
                    this.tileType = data_1.CONSTANTS.TileType.Wall;
                }
            }
        }
        update() {
            // handle automatic state change
            if (this.stateChangeTimer >= 0) {
                this.stateChangeTimer--;
                if (this.stateChangeTimer == -1) {
                    if (this.toggleTime > 0) {
                        this.stateChangeTimer = this.toggleTime;
                        // swap state and next state
                        var temp = this.nextState;
                        this.nextState = this.state;
                        this.state = temp;
                        this.stateChanged = true;
                    }
                    else { // if no toggle 
                        this.state = this.nextState;
                        this.stateChanged = true;
                    }
                }
            }
            // reset script if necessary
            if (this.scriptNeedsReset == true) {
                if (this.checkCollision(this.currentLevel.player) == 0) {
                    this.scriptNeedsReset = false;
                }
            }
            this.updateState();
        }
        processScript(thing) {
            var i, newX = -1, newY = -1;
            var levelFile = null;
            // make sure the script doesn't keep firing forever
            this.scriptNeedsReset = true;
            // if (this.numInstructions > 0) {
            //     console.log(this.script);
            // }
            for (var i = 0; i < this.numInstructions; i++) {
                var instr = this.script[i];
                switch (instr.id) {
                    case data_1.CONSTANTS.ScriptInstrType.SetState:
                        {
                            let ins = instr;
                            // find the tile at ins.x, ins.y and set its state
                            this.currentLevel.tileObjects[ins.x][ins.y].state = ins.newState;
                            this.currentLevel.tileObjects[ins.x][ins.y].nextState = ins.newState;
                            this.currentLevel.tileObjects[ins.x][ins.y].stateChangeTimer = -1;
                            this.currentLevel.tileObjects[ins.x][ins.y].toggleTime = -1;
                            this.currentLevel.tileObjects[ins.x][ins.y].stateChanged = true;
                            this.currentLevel.tileObjects[ins.x][ins.y].updateState();
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.SetStateTemp:
                        {
                            let ins = instr;
                            // find the tile at ins.x, ins.y and set its state
                            // and set its timer and next state vars
                            this.currentLevel.tileObjects[ins.x][ins.y].state = ins.newState1;
                            this.currentLevel.tileObjects[ins.x][ins.y].nextState = ins.newState2;
                            this.currentLevel.tileObjects[ins.x][ins.y].stateChangeTimer = ins.time;
                            this.currentLevel.tileObjects[ins.x][ins.y].toggleTime = -1;
                            this.currentLevel.tileObjects[ins.x][ins.y].stateChanged = true;
                            this.currentLevel.tileObjects[ins.x][ins.y].updateState();
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.ToggleState:
                        {
                            let ins = instr;
                            // find the tile at ins.x, ins.y and set its state
                            // and set its timer and next state and toggle vars
                            this.currentLevel.tileObjects[ins.x][ins.y].state = ins.newState1;
                            this.currentLevel.tileObjects[ins.x][ins.y].nextState = ins.newState2;
                            if (ins.delay > 0)
                                this.currentLevel.tileObjects[ins.x][ins.y].stateChangeTimer = ins.delay;
                            else
                                this.currentLevel.tileObjects[ins.x][ins.y].stateChangeTimer = ins.time;
                            this.currentLevel.tileObjects[ins.x][ins.y].toggleTime = ins.time;
                            this.currentLevel.tileObjects[ins.x][ins.y].stateChanged = true;
                            this.currentLevel.tileObjects[ins.x][ins.y].updateState();
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.LoadLevel:
                        {
                            let ins = instr;
                            // load level file ins.filename
                            data_1.GAME.load_level(ins.filename);
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.PlaySound:
                        {
                            let ins = instr;
                            // play sound at index ins.sound_id
                            bob_1.BOBAPI.DSound_Play(ins.sound_id);
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.PlayMusic:
                        {
                            let ins = instr;
                            // play music at index ins.music_id 
                            bob_1.BOBAPI.DMusic_Play(ins.music_id);
                            this.currentLevel.songID = ins.music_id;
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.Teleport:
                        {
                            let ins = instr;
                            // teleport player to tile_x, tile_y
                            //newX = ins.tile_x*40;
                            //newY = ins.tile_y*40;
                            this.currentLevel.player.x = ins.tile_x * 40;
                            this.currentLevel.player.y = ins.tile_y * 40;
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.TextBox:
                        {
                            let ins = instr;
                            // text box 
                            data_1.GAME.show_text_box(ins.text);
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.Lights:
                        {
                            let ins = instr;
                            // text box 
                            data_1.GAME.set_lights(ins.on_or_off);
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.WinGame:
                        {
                            let ins = instr;
                            // run end game
                            data_1.GAME.game_win_game();
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.RestoreHealth:
                        {
                            let ins = instr;
                            // restore health
                            this.currentLevel.player.health = 100;
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.Jump:
                        {
                            let ins = instr;
                            // move instruction pointer
                            i += ins.howFar;
                            if (i < 0)
                                i = 0;
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.JumpIfEqual:
                        {
                            let ins = instr;
                            // move instruction pointer if condition is met
                            if (this.currentLevel.tileObjects[ins.x][ins.y].state == ins.state) {
                                i += ins.howFar;
                                if (i < 0)
                                    i = 0;
                            }
                            break;
                        }
                    case data_1.CONSTANTS.ScriptInstrType.JumpIfNotEqual:
                        {
                            let ins = instr;
                            // move instruction pointer if condition is met
                            if (this.currentLevel.tileObjects[ins.x][ins.y].state != ins.state) {
                                i += ins.howFar;
                                if (i < 0)
                                    i = 0;
                            }
                            break;
                        }
                }
            }
        }
        getDistance(thing) {
            return Math.sqrt(Math.pow((this.currentLevel.player.x - thing.x), 2) +
                Math.pow((this.currentLevel.player.y - thing.y), 2));
        }
    }
    exports.Tile = Tile;
    // script instruction definitions
    class instr {
    }
    exports.instr = instr;
    class set_state_instr extends instr {
    }
    exports.set_state_instr = set_state_instr;
    ;
    class set_state_temp_instr extends instr {
    }
    exports.set_state_temp_instr = set_state_temp_instr;
    ;
    class load_level_instr extends instr {
    }
    exports.load_level_instr = load_level_instr;
    ;
    class play_sound_instr extends instr {
    }
    exports.play_sound_instr = play_sound_instr;
    ;
    class play_music_instr extends instr {
    }
    exports.play_music_instr = play_music_instr;
    ;
    class teleport_instr extends instr {
    }
    exports.teleport_instr = teleport_instr;
    ;
    class text_box_instr extends instr {
    }
    exports.text_box_instr = text_box_instr;
    ;
    class toggle_state_instr extends instr {
    }
    exports.toggle_state_instr = toggle_state_instr;
    ;
    class win_game_instr extends instr {
    }
    exports.win_game_instr = win_game_instr;
    ;
    class restore_health_instr extends instr {
    }
    exports.restore_health_instr = restore_health_instr;
    ;
    class lights_instr extends instr {
    }
    exports.lights_instr = lights_instr;
    ;
    class jump_instr extends instr {
    }
    exports.jump_instr = jump_instr;
    ;
    class jump_if_equal_instr extends instr {
    }
    exports.jump_if_equal_instr = jump_if_equal_instr;
    ;
    class jump_if_not_equal_instr extends instr {
    }
    exports.jump_if_not_equal_instr = jump_if_not_equal_instr;
    ;
});
//# sourceMappingURL=tile.js.map