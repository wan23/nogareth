import { BOB, BOBAPI } from "./bob";
import { Level } from "./level";
import { Thing } from "./thing";
import { CONSTANTS, GAME } from "./data";
import { Enemy } from "./enemy";

export class Tile extends Thing {
    tileID:number;
    tileType:number;

    script: instr[];
    numInstructions:number;
	
	// // allow for a tile to change its state after a certain time
	stateChangeTimer:number;
	toggleTime:number;	// if > 0 then tile will change state every toggleTime frames
	nextState:number;

	scriptLoaded:boolean;
	scriptNeedsReset:boolean;	//script will not fire unless player steps off and on tile
	
	stateChanged:boolean;		//in case there's some special case that needs to be handled

    constructor(x: number, y:number, t:number, bob:BOB, l:Level){
        super(x, y, bob, l);
        this.tileID = t;
        this.type_id = CONSTANTS.GameType.TILE;
        this.height = CONSTANTS.TileHeight;
        this.width = CONSTANTS.TileWidth;
        if (this.tileID<104)
            this.tileType = CONSTANTS.TileType.Wall;
        if (this.tileID>=104 && this.tileID<132)
        this.tileType = CONSTANTS.TileType.Floor;
        if ((this.tileID>=132 && this.tileID<136) || this.tileID==138)
        this.tileType = CONSTANTS.TileType.Hole;
        if (this.tileID==137){
            this.tileType = CONSTANTS.TileType.Spike;
            this.state = CONSTANTS.TileState.Up;
        }
        if (this.tileID==136){
            this.tileType = CONSTANTS.TileType.Spike;
        }	this.state = CONSTANTS.TileState.Down;

        this.scriptLoaded = false;
        this.scriptNeedsReset = false;
        this.script = [];
    }

    draw()
    {
        this.processAnimation();
        this.defaultDraw();
    }

    processAnimation()
    {
        this.currentFrame = this.tileID;
        this.bob.curr_frame = this.currentFrame;
        this.bob.x = this.x;
        this.bob.y = this.y;
    }

    //handleCollision will process the script language, and then
    //call defaultHandleCollision if needed.
    handleCollision(thing:Thing)
    {	
        if (thing.type_id == CONSTANTS.GameType.PLAYER){
            if (this.scriptLoaded == true && this.scriptNeedsReset==false) {
                this.processScript(thing);
            }
        }

        // If you're on a script don't process
        if (!this.scriptNeedsReset) {
            this.defaultHandleCollision(thing);
        }
    }

    defaultHandleCollision(thing:Thing)
    {
        //if the thing it collided with was a PLAYER
        if (thing.type_id==CONSTANTS.GameType.PLAYER || thing.type_id==CONSTANTS.GameType.ENEMY)
        {
            //if this tile is a WALL
            if(this.tileType==CONSTANTS.TileType.Wall)
            {
                //if the player is currently moving horizontally,
                //move him to the edge of this tile.
                if (thing.movingX)
                {
                    this.moveToEdgeX(thing, this);
                }
                else
                {
                    this.moveToEdgeY(thing, this);
                }
                
            }
            else if (this.tileType==CONSTANTS.TileType.Hole)
            {
                //thing.state=FALLING;
                
                if (this.currentLevel.getTileObject(thing.x,thing.y).tileType == CONSTANTS.TileType.Hole
                && this.currentLevel.getTileObject(thing.x+thing.width-1,thing.y).tileType == CONSTANTS.TileType.Hole
                && this.currentLevel.getTileObject(thing.x+thing.width-1,thing.y+thing.height-1).tileType == CONSTANTS.TileType.Hole
                && this.currentLevel.getTileObject(thing.x,thing.y+thing.height-1).tileType == CONSTANTS.TileType.Hole
                )
                {
                    thing.state=CONSTANTS.ThingState.FALLING;
                    thing.animationCounter = 0;
                    if (thing.type_id==CONSTANTS.GameType.PLAYER)
                        BOBAPI.DSound_Play(4);

                    if (thing.type_id==CONSTANTS.GameType.ENEMY)
                    {
                        var tempEnemy = thing as Enemy;
                        // TODO: Should this include red zombies? In the original game it didn't but looks like a bug
                        if( tempEnemy.enemyID==CONSTANTS.EnemyType.GreyZombie)
                        {
                            if (this.getDistance(thing)<350)
                                BOBAPI.DSound_Play(9);
                        }
                    }
                }
                
            }

            else if (this.tileType==CONSTANTS.TileType.Spike)
            {
                if(this.state==CONSTANTS.TileState.Up)
                {
                    thing.hurt(1);
                    // if (thing.type_id==CONSTANTS.GameType.PLAYER)
                    //     BOBAPI.DSound_Play(1);
                }
                
            }
        }

    }

    updateState()
    {
        // hard code special tiles (Thanks Neal!)
        // what the? its not my fault you BABAR

        // spike
        if (this.tileType == CONSTANTS.TileType.Spike){
            if (this.stateChanged){
                if (this.state == CONSTANTS.TileState.On){
                    this.toggleTime = 150;
                    this.stateChangeTimer = this.toggleTime;
                    this.state = CONSTANTS.TileState.Up;
                    this.nextState = CONSTANTS.TileState.Down;
                    
                }
                else if (this.state == CONSTANTS.TileState.Up){
                    // set the tileid and that it kills things
                    this.tileID = 137;
                }
                else if (this.state == CONSTANTS.TileState.Down){
                    // set the tileid and that it doesn't kill things
                    this.tileID = 136;
                }

                this.stateChanged = false;
            }
        }
        else if (this.tileID >= 96 && this.tileID < 100)
        {
            if (this.stateChanged && this.state == CONSTANTS.TileState.Off)
            {
                BOBAPI.DSound_Play(7);
                this.tileID += 4;
                this.stateChanged = false;
                this.tileType = CONSTANTS.TileType.Wall;
            }
            
        }
        else if (this.tileID >= 100 && this.tileID <104)
        {
            if (this.stateChanged && this.state == CONSTANTS.TileState.On)
            {
                BOBAPI.DSound_Play(7);
                this.tileID -= 4;
                this.stateChanged = false;
                this.tileType = CONSTANTS.TileType.Wall;
            }

        }
    }

    update()
    {
        // handle automatic state change
        if (this.stateChangeTimer >= 0){
            this.stateChangeTimer--;
            if(this.stateChangeTimer == -1){
                if (this.toggleTime > 0){
                    this.stateChangeTimer = this.toggleTime;
                    // swap state and next state
                    var temp = this.nextState;
                    this.nextState = this.state;
                    this.state = temp;
                    this.stateChanged = true;
                }
                else{	// if no toggle 
                    this.state = this.nextState;
                    this.stateChanged = true;
                }
            }
        }

        // reset script if necessary
        if (this.scriptNeedsReset==true){		
            if (this.checkCollision(this.currentLevel.player)==0)
            {			
                this.scriptNeedsReset = false;
            }
        }
        
        this.updateState();
    }

    processScript(thing:Thing)
    {
        var i:number, newX=-1, newY=-1;
        var levelFile:string = null;

        // make sure the script doesn't keep firing forever
        this.scriptNeedsReset = true;
        
        // if (this.numInstructions > 0) {
        //     console.log(this.script);
        // }
        for (var i=0; i<this.numInstructions; i++){
            var instr = this.script[i];
            
            switch (instr.id){
            case CONSTANTS.ScriptInstrType.SetState:
                {
                    let ins = instr as set_state_instr;
                    // find the tile at ins.x, ins.y and set its state
                    this.currentLevel.tileObjects[ins.x][ins.y].state = ins.newState;
                    this.currentLevel.tileObjects[ins.x][ins.y].nextState = ins.newState;
                    this.currentLevel.tileObjects[ins.x][ins.y].stateChangeTimer = -1;
                    this.currentLevel.tileObjects[ins.x][ins.y].toggleTime = -1;
                    this.currentLevel.tileObjects[ins.x][ins.y].stateChanged = true;
                    this.currentLevel.tileObjects[ins.x][ins.y].updateState();

                    break;
                }
            case CONSTANTS.ScriptInstrType.SetStateTemp:
                {
                    let ins = instr as set_state_temp_instr;
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
            case CONSTANTS.ScriptInstrType.ToggleState:
                {
                    let ins = instr as toggle_state_instr;
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
            case CONSTANTS.ScriptInstrType.LoadLevel:
                {
                    let ins = instr as load_level_instr;
                    // load level file ins.filename
                    GAME.load_level(ins.filename);

                    break;
                }
            case CONSTANTS.ScriptInstrType.PlaySound:
                {
                    let ins = instr as play_sound_instr;
                    // play sound at index ins.sound_id
                    BOBAPI.DSound_Play(ins.sound_id);
                    break;
                }

            case CONSTANTS.ScriptInstrType.PlayMusic:
                {
                    let ins = instr as play_music_instr;
                    
                    // play music at index ins.music_id 
                    BOBAPI.DMusic_Play(ins.music_id);
                    this.currentLevel.songID = ins.music_id;
                    break;
                }
            case CONSTANTS.ScriptInstrType.Teleport:
                {
                    let ins = instr as teleport_instr;
                    // teleport player to tile_x, tile_y
                    //newX = ins.tile_x*40;
                    //newY = ins.tile_y*40;
                    
                    this.currentLevel.player.x = ins.tile_x*40;
                    this.currentLevel.player.y = ins.tile_y*40;

                    break;
                }
            case CONSTANTS.ScriptInstrType.TextBox:
                {
                    let ins = instr as text_box_instr;
                    // text box 

                    GAME.show_text_box(ins.text);
                    break;
                }
            case CONSTANTS.ScriptInstrType.Lights:
                {
                    let ins = instr as lights_instr;
                    // text box 
                    GAME.set_lights(ins.on_or_off);
                    break;
                }

            case CONSTANTS.ScriptInstrType.WinGame:
                {
                    let ins = instr as win_game_instr;
                    // run end game
                    GAME.game_win_game();
                    break;				
                }
            case CONSTANTS.ScriptInstrType.RestoreHealth:
                {
                    let ins = instr as restore_health_instr;
                    // restore health
                    this.currentLevel.player.health = 100;
                    
                    break;
                    
                }
            case CONSTANTS.ScriptInstrType.Jump:
                {
                    let ins = instr as jump_instr;
                    // move instruction pointer
                    i += ins.howFar;
                    if (i < 0) i = 0; 
                    break;				
                }
            case CONSTANTS.ScriptInstrType.JumpIfEqual:
                {
                    let ins = instr as jump_if_equal_instr;
                    // move instruction pointer if condition is met
                    if (this.currentLevel.tileObjects[ins.x][ins.y].state == ins.state){
                        i += ins.howFar;
                        if (i < 0) i = 0; 
                    }
                    break;				
                }
            case CONSTANTS.ScriptInstrType.JumpIfNotEqual:
                {
                    let ins = instr as jump_if_not_equal_instr;
                    // move instruction pointer if condition is met
                    if (this.currentLevel.tileObjects[ins.x][ins.y].state != ins.state){
                        i += ins.howFar;
                        if (i < 0) i = 0; 
                    }
                    break;				
                }

            }
        }

    }


    getDistance(thing:Thing) : number
    {
        return Math.sqrt( Math.pow((this.currentLevel.player.x-thing.x),2) +
                          Math.pow((this.currentLevel.player.y-thing.y),2));
    }

}

// script instruction definitions
export class instr {
    id: number;
}

export class set_state_instr extends instr
{
	id: number;
	x: number;
	y: number;
	newState: number;
};

export class set_state_temp_instr extends instr
{

	id: number;
	x: number;
	y: number;
	newState1: number;
	newState2: number;
	time: number;
};

export class load_level_instr extends instr
{
	id: number;
	filename: string;
};

export class play_sound_instr extends instr
{
	id: number;
	sound_id: number;
};

export class play_music_instr extends instr
{
	id: number;
	music_id: number;
};

export class teleport_instr extends instr
{
	id: number;
	tile_x: number;
	tile_y: number;
};

export class text_box_instr extends instr
{
	id: number;
	text: string;
};

export class toggle_state_instr extends instr
{
	id: number;
	x: number;
	y: number;
	newState1: number;
	newState2: number;
	time: number;
	delay: number;
};

export class win_game_instr extends instr
{
	id: number;
};

export class restore_health_instr extends instr
{
	id: number;
};

export class lights_instr extends instr
{
	id: number;
	on_or_off: boolean;
};

export class jump_instr extends instr
{
	id: number;
	howFar: number;
};

export class jump_if_equal_instr extends instr
{
	id: number;
	x: number;
	y: number;
	state: number;
	howFar: number;
};

export class jump_if_not_equal_instr extends instr
{
	id: number;
	x: number;
	y: number;
	state: number;
	howFar: number;
};