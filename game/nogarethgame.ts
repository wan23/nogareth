import { InputController } from "./input_controller";
import { DATA, ALL_BOBS, setCanvas, setPlayer, PLAYER, CONSTANTS, setGame, setInputController, INPUTCONTROLLER } from "./data";
import { BOB, BOBAPI } from "./bob";
import { Level } from "./level";
import { Player } from "./player";

export class NoGarethGame {

    ctx: CanvasRenderingContext2D;
    inputController: InputController;
    boxX: number = 50;
    boxY: number = 50;
    garethBob: BOB;

    currentFrame: number = 0;
    textBoxText: string;
    currentLevel: Level; //renamed this from level to testLevel, its what the original used, we can update after
    nextLevel: string;


    backColor = 0; //color with which screen is cleared
    gameState = 0; //general state the game is in
    win_game = false;
    lights_on = true;

    constructor(ctx: CanvasRenderingContext2D, inputController: InputController) {
        this.ctx = ctx;
        this.inputController = inputController;
        this.garethBob = ALL_BOBS.Gareth;


        setCanvas(ctx);
        setGame(this);
        setInputController(this.inputController);

        this.gameState = CONSTANTS.GameState.GAME_INTRO;
        // BOBAPI.DMusic_Play(7);
    }

    newGame(continueGame=false) {
        this.gameState = CONSTANTS.GameState.GAME_RUNNING;
        var newPlayer = new Player(CONSTANTS.StartX, CONSTANTS.StartY, this.garethBob, null);
        if (continueGame) {
            newPlayer.hasRedKey = PLAYER.hasRedKey;
            newPlayer.hasBlueKey = PLAYER.hasBlueKey;
            newPlayer.hasGreenKey = PLAYER.hasGreenKey;
        }
        setPlayer(newPlayer);
        this.win_game = false
        this.load_level("Levels/mikeslevel.txt");
    }

    clearScreen() {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    Game_Main() {
        this.inputController.update();

        if (INPUTCONTROLLER.KEY_PRESS=="q")
        {
            location.reload();
        }
        if (INPUTCONTROLLER.KEY_PRESS=="Escape")
        {
            // if (this.gameState!=CONSTANTS.GameState.GAME_INTRO)
            //     BOBAPI.DMusic_Play(7);
            this.stop_all_music();
            this.gameState=CONSTANTS.GameState.GAME_INTRO;
        }
        if (this.gameState == CONSTANTS.GameState.GAME_INTRO)
            this.game_intro();
        
        if (this.gameState == CONSTANTS.GameState.GAME_PAUSED)
	        this.game_paused();

        if (this.gameState == CONSTANTS.GameState.GAME_HELP)
            this.game_help();
    
        if (this.gameState == CONSTANTS.GameState.GAME_ABOUT)
            this.game_about();
            
        if (this.gameState == CONSTANTS.GameState.GAME_RUNNING)
            this.game_running();
        
        if (this.gameState == CONSTANTS.GameState.GAME_WIN)
            this.game_win()

        if (this.gameState == CONSTANTS.GameState.GAME_OVER)
            this.game_over();

        if (this.gameState == CONSTANTS.GameState.GAME_TEXT_BOX)
            this.game_text_box();
    }

    game_running() {
        this.clearScreen();

        if (this.win_game && PLAYER.state==CONSTANTS.ThingState.FALLING && !PLAYER.alive)
	    {
            this.gameState=CONSTANTS.GameState.GAME_WIN;
            BOBAPI.DMusic_Play(6);
            return;
	    }
        if (!PLAYER.alive || PLAYER.health<=0)
        {
            this.gameState = CONSTANTS.GameState.GAME_OVER;
            BOBAPI.DSound_Play(8);
            return;
        }

        if (INPUTCONTROLLER.KEY_PRESS=="p")
        {
            this.gameState = CONSTANTS.GameState.GAME_PAUSED;
        }

        //HOWFIN'S UGLY CODE
        // update tiles
        for (let i = 0; i < this.currentLevel.width; i++)
            for (let j = 0; j < this.currentLevel.height; j++)
                this.currentLevel.tileObjects[i][j].update();
        //HOWFIN'S UGLY CODE

        //process player
        PLAYER.update();
        PLAYER.move();


        //process enemies (TBA)
        this.currentLevel.updateEnemies();
        this.currentLevel.moveEnemies();

        //process objects
        this.currentLevel.updateObjects();
        this.currentLevel.moveObjects();

        //update objectlist
        this.currentLevel.updateObjectList();
        this.currentLevel.updateEnemyList();

        //DRAWING PHASE
        this.draw_tiles();
        this.currentLevel.drawObjects();
        this.currentLevel.drawEnemies();
        PLAYER.draw();

        
        // lighting!!
        //	overlay_darkness_slow();
        if (this.lights_on == false) {
            BOBAPI.Draw_BOB16(ALL_BOBS.DarknessOverlay);
        }
        
        // draw information elements
        this.draw_lifebar();
        
        this.show_keys();
        
    }

    draw_tiles() {
        let tempX:number; 
        let tempY:number; 
        tempX = Math.floor((PLAYER.x - (PLAYER.x % 40))/40)-8;
        tempY = Math.floor((PLAYER.y - (PLAYER.y % 40))/40)-6;

        if (tempX<0)
            tempX=0;
        if (tempX>this.currentLevel.width-17)
            tempX = this.currentLevel.width-17;
        if (tempY<0)
            tempY=0;
        if (tempY>this.currentLevel.height-13)
            tempY = this.currentLevel.height-13;

        for (let i = tempX;i<tempX+17;i++)
        {
            for (let j = tempY;j<tempY+13;j++)
            {
                this.currentLevel.tileObjects[i][j].draw();
            }
        }
    }

    draw_all_tiles() {
        for (var i = 0; i < this.currentLevel.width; i++) {
            for (var j = 0; j < this.currentLevel.height; j++) {
                this.currentLevel.tileObjects[i][j].draw();
            }
        }
    }

    //keep these names the same for ease of porting
    show_text_box(text: string) {
        BOBAPI.DSound_Play(3);
        this.gameState = CONSTANTS.GameState.GAME_TEXT_BOX;
        this.textBoxText = text;
    }

    show_keys()
    {
        ALL_BOBS.KeyOverlay.x = 500;
        ALL_BOBS.KeyOverlay.y = 18;
        BOBAPI.Draw_BOB16(ALL_BOBS.KeyOverlay);
        if (PLAYER.hasRedKey)
        {
            ALL_BOBS.ObjectSet.curr_frame=0;
            ALL_BOBS.ObjectSet.x = 533;
            ALL_BOBS.ObjectSet.y = 11;
            BOBAPI.Draw_BOB16(ALL_BOBS.ObjectSet);
        }
        if (PLAYER.hasGreenKey)
        {
            ALL_BOBS.ObjectSet.curr_frame=2;
            ALL_BOBS.ObjectSet.x = 548;
            ALL_BOBS.ObjectSet.y = 11;
            BOBAPI.Draw_BOB16(ALL_BOBS.ObjectSet);
        }
        if (PLAYER.hasBlueKey)
        {
            ALL_BOBS.ObjectSet.curr_frame=1;
            ALL_BOBS.ObjectSet.x = 563;
            ALL_BOBS.ObjectSet.y = 11;
            BOBAPI.Draw_BOB16(ALL_BOBS.ObjectSet);
        }
    }

    set_lights(onOrOff: boolean) {
        this.lights_on = onOrOff;
    }

    stop_all_music(){
        BOBAPI.DMusic_Stop();
    }

    game_intro(){

        if (INPUTCONTROLLER.Key_Start) {
            this.newGame()
		    return;
        } 
        if (INPUTCONTROLLER.KEY_PRESS=="h") {
            this.gameState=CONSTANTS.GameState.GAME_HELP;
        } 
        if (INPUTCONTROLLER.KEY_PRESS=="a") {
            this.gameState=CONSTANTS.GameState.GAME_ABOUT;
        } 

        ALL_BOBS.GameScreens.curr_frame=0;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
    }

    game_about(){

        ALL_BOBS.GameScreens.curr_frame=3;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
    }

    game_help()
    {
        ALL_BOBS.GameScreens.curr_frame=4;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
    }

    game_paused(){
        if (INPUTCONTROLLER.Key_Start) {
            this.gameState=CONSTANTS.GameState.GAME_RUNNING;
		    return;
        } 

        ALL_BOBS.GameScreens.curr_frame=1;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
    }

    game_win_game() {
        this.win_game = true;
        console.log("You win!!");
    }

    game_over() {
        ALL_BOBS.GameScreens.curr_frame=2;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
        
        if (INPUTCONTROLLER.Key_Start) {
            this.newGame(true);
		    return;
        } 
    }

    game_win() {
        ALL_BOBS.GameScreens.curr_frame=5;
        BOBAPI.Draw_BOB16(ALL_BOBS.GameScreens);
        
        if (INPUTCONTROLLER.Key_Start) {
            this.newGame()
		    return;
        } 
    }

    game_text_box()
    {
        if (INPUTCONTROLLER.Key_Start) {
            this.gameState = CONSTANTS.GameState.GAME_RUNNING;
		    return;
        }

        //DRAWING PHASE
        this.draw_tiles();
        this.currentLevel.drawObjects();
        this.currentLevel.drawEnemies();
        PLAYER.draw();
        
        if (this.lights_on == false) {
            BOBAPI.Draw_BOB16(ALL_BOBS.DarknessOverlay);
        }

        // Draw a text box

        var color = BOBAPI.RGB(255,255,255);
        var textColor = BOBAPI.RGB(255, 255, 255);
        var backColor = 'blue';
        var x,y,width,height;
        
        x = 100;
        y = 20;
        width = CONSTANTS.ScreenWidth - 220;
        height = 180;

        var left = x+2;
        var top = y+2;
        var right = x + width-2;
        var bottom = y + height-2;

        let textHeight = 18;
        let padding = 16;

        // draw a rectangle

        BOBAPI.Draw_Line16(x,y,x+width,y,color);
        BOBAPI.Draw_Line16(x,y,x,y+height,color);
        BOBAPI.Draw_Line16(x+width,y,x+width,y+height,color);
        BOBAPI.Draw_Line16(x,y+height,x+width,y+height,color);

        // draw transparent background
        for (var i=x+1; i<x+width; i++){
            for (var j=y+1; j<y+height; j++){
                if ((i + j )%2==0)
                    BOBAPI.Draw_Pixel16(i, j, backColor);
            }
        }
        // draw the text
        BOBAPI.DrawText(this.textBoxText, left + padding, top + padding , right - padding - left, textHeight, textColor);

	    BOBAPI.DrawText("Press Enter to continue", left + 160, bottom - 4, right - padding - left, textHeight, "black"); 

    }

    draw_lifebar()
    {
		var color = 'black';
		var x,y,width,height;
		x = 100;
		y = 20;
		width = 101;
		height = 21;
		BOBAPI.Draw_Line16(x,y,x+width,y,color);
		BOBAPI.Draw_Line16(x,y,x,y+height,color);
		BOBAPI.Draw_Line16(x+width,y,x+width,y+height,color);
		BOBAPI.Draw_Line16(x,y+height,x+width,y+height,color);

		ALL_BOBS.LifeOverlay.x = 30;
		ALL_BOBS.LifeOverlay.y = 17;
		BOBAPI.Draw_BOB16(ALL_BOBS.LifeOverlay);
		let temp2 =  this.currentLevel.player.health;
		if (temp2>100)
			temp2 = 100;
		for (var i = 0;i<temp2;i++)
		{
            color = BOBAPI.RGB(0,185+i/15,0);
			BOBAPI.Draw_Line16(x+1+i,y+1,x+1+i,y+height-1,color);
		}
    }

    // TODO: Change this to load a level by constant
    load_level(levelFile: string) {
        this.lights_on = true;
        if (levelFile[7] == 'm' || levelFile[7] == 'M')
            this.currentLevel = new Level(DATA.levels.MikeLevel, ALL_BOBS.MikeLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);
        if (levelFile[7] == 'n' || levelFile[7] == 'N')
            this.currentLevel = new Level(DATA.levels.NeilLevel, ALL_BOBS.NeilLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);
        if (levelFile[7] == 'j' || levelFile[7] == 'J')
            this.currentLevel = new Level(DATA.levels.Juanlevel, ALL_BOBS.JuanLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);

        this.gameState = CONSTANTS.GameState.GAME_RUNNING;
    }
    
    DEBUGMODE = false;
    DEBUG1:any;
    DEBUG2:any;
    DEBUG3:any;
    DEBUG4:any;

}