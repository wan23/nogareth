define(["require", "exports", "./data", "./bob", "./level", "./player"], function (require, exports, data_1, bob_1, level_1, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoGarethGame = void 0;
    class NoGarethGame {
        constructor(ctx, inputController) {
            this.boxX = 50;
            this.boxY = 50;
            this.currentFrame = 0;
            this.backColor = 0; //color with which screen is cleared
            this.gameState = 0; //general state the game is in
            this.win_game = false;
            this.lights_on = true;
            this.DEBUGMODE = false;
            this.ctx = ctx;
            this.inputController = inputController;
            this.garethBob = data_1.ALL_BOBS.Gareth;
            data_1.setCanvas(ctx);
            data_1.setGame(this);
            data_1.setInputController(this.inputController);
            this.gameState = data_1.CONSTANTS.GameState.GAME_INTRO;
        }
        newGame(continueGame = false) {
            this.gameState = data_1.CONSTANTS.GameState.GAME_RUNNING;
            var newPlayer = new player_1.Player(data_1.CONSTANTS.StartX, data_1.CONSTANTS.StartY, this.garethBob, null);
            if (continueGame) {
                newPlayer.hasRedKey = data_1.PLAYER.hasRedKey;
                newPlayer.hasBlueKey = data_1.PLAYER.hasBlueKey;
                newPlayer.hasGreenKey = data_1.PLAYER.hasGreenKey;
            }
            data_1.setPlayer(newPlayer);
            this.win_game = false;
            this.load_level("Levels/mikeslevel.txt");
        }
        clearScreen() {
            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }
        Game_Main() {
            this.inputController.update();
            if (data_1.INPUTCONTROLLER.KEY_PRESS == "q") {
                location.reload();
            }
            if (data_1.INPUTCONTROLLER.KEY_PRESS == "Escape") {
                this.stop_all_music();
                this.gameState = data_1.CONSTANTS.GameState.GAME_INTRO;
            }
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_INTRO)
                this.game_intro();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_PAUSED)
                this.game_paused();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_HELP)
                this.game_help();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_ABOUT)
                this.game_about();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_RUNNING)
                this.game_running();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_WIN)
                this.game_win();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_OVER)
                this.game_over();
            if (this.gameState == data_1.CONSTANTS.GameState.GAME_TEXT_BOX)
                this.game_text_box();
        }
        game_running() {
            this.clearScreen();
            if (this.win_game && data_1.PLAYER.state == data_1.CONSTANTS.ThingState.FALLING && !data_1.PLAYER.alive) {
                this.gameState = data_1.CONSTANTS.GameState.GAME_WIN;
                bob_1.BOBAPI.DMusic_Play(6);
                return;
            }
            if (!data_1.PLAYER.alive || data_1.PLAYER.health <= 0) {
                this.gameState = data_1.CONSTANTS.GameState.GAME_OVER;
                bob_1.BOBAPI.DSound_Play(8);
                return;
            }
            if (data_1.INPUTCONTROLLER.KEY_PRESS == "p") {
                this.gameState = data_1.CONSTANTS.GameState.GAME_PAUSED;
            }
            //HOWFIN'S UGLY CODE
            // update tiles
            for (let i = 0; i < this.currentLevel.width; i++)
                for (let j = 0; j < this.currentLevel.height; j++)
                    this.currentLevel.tileObjects[i][j].update();
            //HOWFIN'S UGLY CODE
            //process player
            data_1.PLAYER.update();
            data_1.PLAYER.move();
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
            data_1.PLAYER.draw();
            // lighting!!
            //	overlay_darkness_slow();
            if (this.lights_on == false) {
                bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.DarknessOverlay);
            }
            // draw information elements
            this.draw_lifebar();
            this.show_keys();
        }
        draw_tiles() {
            let tempX;
            let tempY;
            tempX = Math.floor((data_1.PLAYER.x - (data_1.PLAYER.x % 40)) / 40) - 8;
            tempY = Math.floor((data_1.PLAYER.y - (data_1.PLAYER.y % 40)) / 40) - 6;
            if (tempX < 0)
                tempX = 0;
            if (tempX > this.currentLevel.width - 17)
                tempX = this.currentLevel.width - 17;
            if (tempY < 0)
                tempY = 0;
            if (tempY > this.currentLevel.height - 13)
                tempY = this.currentLevel.height - 13;
            for (let i = tempX; i < tempX + 17; i++) {
                for (let j = tempY; j < tempY + 13; j++) {
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
        show_text_box(text) {
            bob_1.BOBAPI.DSound_Play(3);
            this.gameState = data_1.CONSTANTS.GameState.GAME_TEXT_BOX;
            this.textBoxText = text;
        }
        show_keys() {
            data_1.ALL_BOBS.KeyOverlay.x = 500;
            data_1.ALL_BOBS.KeyOverlay.y = 18;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.KeyOverlay);
            if (data_1.PLAYER.hasRedKey) {
                data_1.ALL_BOBS.ObjectSet.curr_frame = 0;
                data_1.ALL_BOBS.ObjectSet.x = 533;
                data_1.ALL_BOBS.ObjectSet.y = 11;
                bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.ObjectSet);
            }
            if (data_1.PLAYER.hasGreenKey) {
                data_1.ALL_BOBS.ObjectSet.curr_frame = 2;
                data_1.ALL_BOBS.ObjectSet.x = 548;
                data_1.ALL_BOBS.ObjectSet.y = 11;
                bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.ObjectSet);
            }
            if (data_1.PLAYER.hasBlueKey) {
                data_1.ALL_BOBS.ObjectSet.curr_frame = 1;
                data_1.ALL_BOBS.ObjectSet.x = 563;
                data_1.ALL_BOBS.ObjectSet.y = 11;
                bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.ObjectSet);
            }
        }
        set_lights(onOrOff) {
            this.lights_on = onOrOff;
        }
        stop_all_music() {
            bob_1.BOBAPI.DMusic_Stop();
        }
        game_intro() {
            if (data_1.INPUTCONTROLLER.Key_Start) {
                this.newGame();
                return;
            }
            if (data_1.INPUTCONTROLLER.KEY_PRESS == "h") {
                this.gameState = data_1.CONSTANTS.GameState.GAME_HELP;
            }
            if (data_1.INPUTCONTROLLER.KEY_PRESS == "a") {
                this.gameState = data_1.CONSTANTS.GameState.GAME_ABOUT;
            }
            data_1.ALL_BOBS.GameScreens.curr_frame = 0;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
        }
        game_about() {
            data_1.ALL_BOBS.GameScreens.curr_frame = 3;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
        }
        game_help() {
            data_1.ALL_BOBS.GameScreens.curr_frame = 4;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
        }
        game_paused() {
            if (data_1.INPUTCONTROLLER.Key_Start) {
                this.gameState = data_1.CONSTANTS.GameState.GAME_RUNNING;
                return;
            }
            data_1.ALL_BOBS.GameScreens.curr_frame = 1;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
        }
        game_win_game() {
            this.win_game = true;
            console.log("You win!!");
        }
        game_over() {
            data_1.ALL_BOBS.GameScreens.curr_frame = 2;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
            if (data_1.INPUTCONTROLLER.Key_Start) {
                this.newGame(true);
                return;
            }
        }
        game_win() {
            data_1.ALL_BOBS.GameScreens.curr_frame = 5;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.GameScreens);
            if (data_1.INPUTCONTROLLER.Key_Start) {
                this.newGame();
                return;
            }
        }
        game_text_box() {
            if (data_1.INPUTCONTROLLER.Key_Start) {
                this.gameState = data_1.CONSTANTS.GameState.GAME_RUNNING;
                return;
            }
            //DRAWING PHASE
            this.draw_tiles();
            this.currentLevel.drawObjects();
            this.currentLevel.drawEnemies();
            data_1.PLAYER.draw();
            if (this.lights_on == false) {
                bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.DarknessOverlay);
            }
            // Draw a text box
            var color = bob_1.BOBAPI.RGB(255, 255, 255);
            var textColor = bob_1.BOBAPI.RGB(255, 255, 255);
            var backColor = 'blue';
            var x, y, width, height;
            x = 100;
            y = 20;
            width = data_1.CONSTANTS.ScreenWidth - 220;
            height = 180;
            var left = x + 2;
            var top = y + 2;
            var right = x + width - 2;
            var bottom = y + height - 2;
            let textHeight = 18;
            let padding = 16;
            // draw a rectangle
            bob_1.BOBAPI.Draw_Line16(x, y, x + width, y, color);
            bob_1.BOBAPI.Draw_Line16(x, y, x, y + height, color);
            bob_1.BOBAPI.Draw_Line16(x + width, y, x + width, y + height, color);
            bob_1.BOBAPI.Draw_Line16(x, y + height, x + width, y + height, color);
            // draw transparent background
            for (var i = x + 1; i < x + width; i++) {
                for (var j = y + 1; j < y + height; j++) {
                    if ((i + j) % 2 == 0)
                        bob_1.BOBAPI.Draw_Pixel16(i, j, backColor);
                }
            }
            // draw the text
            bob_1.BOBAPI.DrawText(this.textBoxText, left + padding, top + padding, right - padding - left, textHeight, textColor);
            bob_1.BOBAPI.DrawText("Press Enter to continue", left + 160, bottom - 4, right - padding - left, textHeight, "black");
        }
        draw_lifebar() {
            var color = 'black';
            var x, y, width, height;
            x = 100;
            y = 20;
            width = 101;
            height = 21;
            bob_1.BOBAPI.Draw_Line16(x, y, x + width, y, color);
            bob_1.BOBAPI.Draw_Line16(x, y, x, y + height, color);
            bob_1.BOBAPI.Draw_Line16(x + width, y, x + width, y + height, color);
            bob_1.BOBAPI.Draw_Line16(x, y + height, x + width, y + height, color);
            data_1.ALL_BOBS.LifeOverlay.x = 30;
            data_1.ALL_BOBS.LifeOverlay.y = 17;
            bob_1.BOBAPI.Draw_BOB16(data_1.ALL_BOBS.LifeOverlay);
            let temp2 = this.currentLevel.player.health;
            if (temp2 > 100)
                temp2 = 100;
            for (var i = 0; i < temp2; i++) {
                color = bob_1.BOBAPI.RGB(0, 185 + i / 15, 0);
                bob_1.BOBAPI.Draw_Line16(x + 1 + i, y + 1, x + 1 + i, y + height - 1, color);
            }
        }
        // TODO: Change this to load a level by constant
        load_level(levelFile) {
            this.lights_on = true;
            if (levelFile[7] == 'm' || levelFile[7] == 'M')
                this.currentLevel = new level_1.Level(data_1.DATA.levels.MikeLevel, data_1.ALL_BOBS.MikeLevelTileSet, data_1.ALL_BOBS.ObjectSet, data_1.CONSTANTS.NumObjects, data_1.PLAYER);
            if (levelFile[7] == 'n' || levelFile[7] == 'N')
                this.currentLevel = new level_1.Level(data_1.DATA.levels.NeilLevel, data_1.ALL_BOBS.NeilLevelTileSet, data_1.ALL_BOBS.ObjectSet, data_1.CONSTANTS.NumObjects, data_1.PLAYER);
            if (levelFile[7] == 'j' || levelFile[7] == 'J')
                this.currentLevel = new level_1.Level(data_1.DATA.levels.Juanlevel, data_1.ALL_BOBS.JuanLevelTileSet, data_1.ALL_BOBS.ObjectSet, data_1.CONSTANTS.NumObjects, data_1.PLAYER);
            this.gameState = data_1.CONSTANTS.GameState.GAME_RUNNING;
        }
    }
    exports.NoGarethGame = NoGarethGame;
});
//# sourceMappingURL=nogarethgame.js.map