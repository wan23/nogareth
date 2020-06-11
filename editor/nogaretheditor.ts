import { BOB, BOBAPI } from "../game/bob";
import { Level } from "../game/level";
import { InputController } from "../game/input_controller";
import { DATA, ALL_BOBS, CONSTANTS, PLAYER, INPUTCONTROLLER, setPlayer, setCanvas } from "../game/data";
import { Player } from "../game/player";
import { Tile } from "../game/tile";

export class NoGarethEditor {

    ctx: CanvasRenderingContext2D;
    inputController: InputController;
    currentLevel: Level

    selectedTile: Tile;

    x = 0;
    y = 0;


   constructor(
        ctx: CanvasRenderingContext2D,
        
        inputController: InputController) {
    this.ctx = ctx;
    this.inputController = inputController;

    var newPlayer = new Player(CONSTANTS.StartX, CONSTANTS.StartY, ALL_BOBS.Gareth, null);
    setPlayer(newPlayer);
    setCanvas(ctx);
    ctx.canvas.onmousemove = this.on_select_mode_mouse_move.bind(this);
    
   }

   Editor_Main() {

        this.inputController.update();

        this.select_mode();
        

   }

   select_mode() {
       if (this.currentLevel) {
            this.draw_tiles();
            if (this.selectedTile) {

                let x = this.global_x_to_canvas(this.selectedTile.x);
                let y = this.global_y_to_canvas(this.selectedTile.y);
                let x1 = x + this.selectedTile.width;
                let y1 = y + this.selectedTile.height;
                BOBAPI.Draw_Line16(x, y, x1, y, "red");
                BOBAPI.Draw_Line16(x, y, x, y1, "red");
                BOBAPI.Draw_Line16(x1, y, x1, y1, "red");
                BOBAPI.Draw_Line16(x, y1, x1, y1, "red");
                //console.log(String(x) + " " + String(y) + " " + String(this.selectedTile.x) + " " + String(this.selectedTile.y));
            }
            //this.currentLevel.drawObjects();
            //this.currentLevel.drawEnemies();
       }
    }

    on_select_mode_mouse_move(event:MouseEvent) {
        
        if (this.currentLevel) {
            let x = this.canvas_x_to_global(event.offsetX);
            let y = this.canvas_y_to_global(event.offsetY);
            this.selectedTile = this.currentLevel.getTileObject(x, y);
        }
    }

    canvas_x_to_global(x:number) {
        return PLAYER.x + x;
    }

    canvas_y_to_global(y:number) {
        return PLAYER.y + y;
    }

    global_x_to_canvas(x:number) {
        return x- PLAYER.x;
    }

    global_y_to_canvas(y:number) {
        return y - PLAYER.y;
    }


    // TODO: Change this to load a level by constant
    load_level(levelFile: string) {
        if (levelFile[7] == 'm' || levelFile[7] == 'M')
            this.currentLevel = new Level(DATA.levels.MikeLevel, ALL_BOBS.MikeLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);
        if (levelFile[7] == 'n' || levelFile[7] == 'N')
            this.currentLevel = new Level(DATA.levels.NeilLevel, ALL_BOBS.NeilLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);
        if (levelFile[7] == 'j' || levelFile[7] == 'J')
            this.currentLevel = new Level(DATA.levels.Juanlevel, ALL_BOBS.JuanLevelTileSet,
                ALL_BOBS.ObjectSet, CONSTANTS.NumObjects, PLAYER);
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
                if (i < 0 || j < 0 || i >= this.currentLevel.width || j >= this.currentLevel.height) {
                    continue;
                }
                this.currentLevel.tileObjects[i][j].draw();
            }
        }
    }

}