var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./bob"], function (require, exports, bob_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetRandom = exports.SOUND_FILES = exports.MUSIC_FILES = exports.setInputController = exports.setGame = exports.setPlayer = exports.setCanvas = exports.INPUTCONTROLLER = exports.GAME = exports.PLAYER = exports.CANVAS = exports.ALL_BOBS = exports.DATA = exports.CONSTANTS = void 0;
    function loadAsyncData() {
        return __awaiter(this, void 0, void 0, function* () {
            exports.DATA.levels.MikeLevel = yield loadLevel('data/levels/mikeslevel.txt');
            exports.DATA.levels.Juanlevel = yield loadLevel('data/levels/juanlevel.txt');
            exports.DATA.levels.NeilLevel = yield loadLevel('data/levels/neallevel.txt');
        });
    }
    function loadData() {
        var data = {
            images: {
                Gareth: loadSpriteSheet('data/images/Gareth copy.png'),
                GreyZombie: loadSpriteSheet('data/images/greyZombie.png'),
                RedZombie: loadSpriteSheet('data/images/redZombie.png'),
                Sluggo: loadSpriteSheet('data/images/Slugo.png'),
                Objects: loadSpriteSheet('data/images/objects.png'),
                // Tilesets
                MikeTileSet: loadSpriteSheet('data/images/mikeTileTemplate.bmp'),
                NeilTileSet: loadSpriteSheet('data/images/nealTileTemplate.bmp'),
                JuanTileSet: loadSpriteSheet('data/images/juanTileTemplate.bmp'),
                // Overlays
                KeysOverlay: loadSpriteSheet('data/images/Keys.bmp'),
                LifeOverlay: loadSpriteSheet('data/images/Life.bmp'),
                DarknessOverlay: loadSpriteSheet('data/images/darkness.png'),
                // Game Screens
                IntroMenu: loadSpriteSheet('data/images/introMenu.bmp'),
                PauseScreen: loadSpriteSheet('data/images/pauseScreen.bmp'),
                GameOver: loadSpriteSheet('data/images/gameOver.bmp'),
                About: loadSpriteSheet('data/images/about.bmp'),
                Help: loadSpriteSheet('data/images/help.bmp'),
                Win: loadSpriteSheet('data/images/win.bmp'),
            },
            // Note: These are promises that return the complete text of the file as a string
            // To use: e.g. DATA.levels.MikeLevel.then(callback function)
            levels: {
                MikeLevel: '',
                Juanlevel: '',
                NeilLevel: ''
            },
            sounds: {},
            //needs to be called once before the app loads
            LoadAsync: loadAsyncData
        };
        return data;
    }
    function loadBOBs() {
        var bobs = {
            Gareth: loadGarethBOB(),
            // TODO: Update these
            RedZombie: loadRedZombieBOB(),
            GreyZombie: loadGreyZombieBOB(),
            Sluggo: loadSluggoBOB(),
            MikeLevelTileSet: loadLevelBOB(exports.DATA.images.MikeTileSet),
            NeilLevelTileSet: loadLevelBOB(exports.DATA.images.NeilTileSet),
            JuanLevelTileSet: loadLevelBOB(exports.DATA.images.JuanTileSet),
            ObjectSet: loadObjectsBOB(),
            GameScreens: loadGameScreensBOB(),
            KeyOverlay: loadKeysBob(),
            LifeOverlay: loadLifeOverlayBOB(),
            DarknessOverlay: loadDarknessBOB(),
        };
        return bobs;
    }
    function loadSpriteSheet(url) {
        let img = new Image();
        img.src = url;
        return img;
    }
    //only use this internally in data.ts
    function loadLevel(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            return yield response.text();
        });
    }
    exports.CONSTANTS = {
        TemplateHeight: 35,
        TemplateWidth: 4,
        NumFrames: 35 * 4,
        NumObjects: 15,
        StartX: 13 * 40,
        StartY: 26 * 40,
        TileHeight: 40,
        TileWidth: 40,
        ScreenWidth: 640,
        ScreenHeight: 480,
        // fron Tile.h
        TileType: {
            Wall: 0,
            Floor: 1,
            Hole: 2,
            Spike: 3
        },
        TileState: {
            Off: 0,
            On: 1,
            Up: 2,
            Down: 3
        },
        ScriptInstrType: {
            SetState: 0,
            SetStateTemp: 1,
            LoadLevel: 2,
            PlaySound: 3,
            PlayMusic: 4,
            Teleport: 5,
            TextBox: 6,
            ToggleState: 7,
            WinGame: 8,
            RestoreHealth: 9,
            Lights: 10,
            Jump: 11,
            JumpIfEqual: 12,
            JumpIfNotEqual: 13
        },
        // From Enemy.h
        EnemyType: {
            GreyZombie: 0,
            RedZombie: 1,
            Manic: 2,
            Sluggo: 3
        },
        AiMode: {
            Sleep: 0,
            DumbWalk: 1,
            SeekPlayer: 2
        },
        //from thing.h
        ThingState: {
            NORMAL: 0,
            FALLING: 1
        },
        GameType: {
            PLAYER: 0,
            TILE: 1,
            ENEMY: 2,
            OBJECT: 3
        },
        //from object.h
        ObjectType: {
            REDDOOR: 0,
            GREENDOOR: 1,
            BLUEDOOR: 2,
            REDKEY: 3,
            GREENKEY: 4,
            BLUEKEY: 5,
            KNIFE: 6,
        },
        //from sidescrollerexercise.cpp
        GameState: {
            GAME_INTRO: 0,
            GAME_RUNNING: 1,
            GAME_OVER: 2,
            GAME_TEXT_BOX: 3,
            GAME_PAUSED: 4,
            GAME_HELP: 5,
            GAME_ABOUT: 6,
            GAME_WIN: 7,
            GAME_LOADING_LEVEL: 8,
        }
    };
    exports.DATA = loadData();
    exports.ALL_BOBS = loadBOBs();
    exports.CANVAS = null;
    exports.PLAYER = null;
    exports.GAME = null;
    exports.INPUTCONTROLLER = null;
    function setCanvas(ctx) {
        exports.CANVAS = ctx;
    }
    exports.setCanvas = setCanvas;
    function setPlayer(player) {
        exports.PLAYER = player;
    }
    exports.setPlayer = setPlayer;
    function setGame(game) {
        exports.GAME = game;
    }
    exports.setGame = setGame;
    function setInputController(InputController) {
        exports.INPUTCONTROLLER = InputController;
    }
    exports.setInputController = setInputController;
    exports.MUSIC_FILES = [
        // TODO: The first three slots are unused.
        "data/music/WinCredits.mp3",
        "data/music/WinCredits.mp3",
        "data/music/WinCredits.mp3",
        "data/music/ItFollows.mp3",
        "data/music/Ominous.mp3",
        "data/music/WhereAmI.mp3",
        "data/music/WinCredits.mp3"
    ];
    exports.SOUND_FILES = [
        "data/sounds/laugh.wav",
        "data/sounds/Bounced.wav",
        "data/sounds/Footsteps.wav",
        "data/sounds/messagebox.wav",
        "data/sounds/falling.wav",
        "data/sounds/ZombieSound.wav",
        "data/sounds/Door Big Close.wav",
        "data/sounds/Breaker Switch 1.wav",
        "data/sounds/evillaugh.wav",
        "data/sounds/ZombieFalling.wav",
        "data/sounds/ZombieLostThePlayer.wav",
        "data/sounds/keys.wav",
    ];
    /**
     * @param  {number} exclusiveMaxValue Will be less than this value
     * @returns Random Integer
     *
     * example GetRandom(10) returns 0-9
     */
    function GetRandom(exclusiveMaxValue) {
        return Math.floor(Math.random() * exclusiveMaxValue);
    }
    exports.GetRandom = GetRandom;
    // BOB Loading
    function loadGarethBOB() {
        let garethBob = bob_1.BOBAPI.Create_BOB(0, 0, 26, 40, 15);
        let garethImage = exports.DATA.images.Gareth;
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 0, 0, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 1, 1, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 2, 2, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 3, 0, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 4, 1, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 5, 2, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 6, 0, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 7, 1, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 8, 2, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 9, 0, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 10, 1, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 11, 2, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 12, 0, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 13, 1, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(garethBob, garethImage, 14, 2, 4);
        return garethBob;
    }
    function loadLifeOverlayBOB() {
        let lifeOverlay = bob_1.BOBAPI.Create_BOB(0, 0, 176, 28, 1);
        let lifeImage = exports.DATA.images.LifeOverlay;
        bob_1.BOBAPI.Load_Frame_BOB16(lifeOverlay, lifeImage, 0, 0, 0, false);
        return lifeOverlay;
    }
    function loadDarknessBOB() {
        let darknessOverlay = bob_1.BOBAPI.Create_BOB(0, 0, 640, 480, 1);
        let darknessImage = exports.DATA.images.DarknessOverlay;
        bob_1.BOBAPI.Load_Frame_BOB16(darknessOverlay, darknessImage, 0, 0, 0, false);
        return darknessOverlay;
    }
    function loadKeysBob() {
        let keysOverlay = bob_1.BOBAPI.Create_BOB(0, 0, 100, 28, 1);
        let keysImage = exports.DATA.images.KeysOverlay;
        bob_1.BOBAPI.Load_Frame_BOB16(keysOverlay, keysImage, 0, 0, 0, false);
        return keysOverlay;
    }
    function loadGameScreensBOB() {
        let bob = bob_1.BOBAPI.Create_BOB(0, 0, 640, 480, 6);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.IntroMenu, 0, 0, 0, false);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.PauseScreen, 1, 0, 0, false);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.GameOver, 2, 0, 0, false);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.About, 3, 0, 0, false);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.Help, 4, 0, 0, false);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, exports.DATA.images.Win, 5, 0, 0, false);
        return bob;
    }
    function loadGreyZombieBOB() {
        let bob = bob_1.BOBAPI.Create_BOB(0, 0, 30, 40, 15);
        let image = exports.DATA.images.GreyZombie;
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 0, 0, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 1, 1, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 2, 2, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 3, 0, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 4, 1, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 5, 2, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 6, 0, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 7, 1, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 8, 2, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 9, 0, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 10, 1, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 11, 2, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 12, 0, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 13, 1, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 14, 2, 4);
        return bob;
    }
    function loadRedZombieBOB() {
        let bob = bob_1.BOBAPI.Create_BOB(0, 0, 30, 40, 15);
        let image = exports.DATA.images.RedZombie;
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 0, 0, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 1, 1, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 2, 2, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 3, 0, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 4, 1, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 5, 2, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 6, 0, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 7, 1, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 8, 2, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 9, 0, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 10, 1, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 11, 2, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 12, 0, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 13, 1, 4);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 14, 2, 4);
        return bob;
    }
    function loadSluggoBOB() {
        let bob = bob_1.BOBAPI.Create_BOB(0, 0, 28, 40, 12);
        let image = exports.DATA.images.Sluggo;
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 0, 0, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 1, 1, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 2, 2, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 3, 0, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 4, 1, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 5, 2, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 6, 0, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 7, 1, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 8, 2, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 9, 0, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 10, 1, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 11, 2, 3);
        return bob;
    }
    function loadLevelBOB(imageData) {
        let tileSetBOB = bob_1.BOBAPI.Create_BOB(0, 0, 40, 40, exports.CONSTANTS.NumFrames);
        var counter = 0;
        for (var j = 0; j < exports.CONSTANTS.TemplateHeight; j++) {
            for (var i = 0; i < exports.CONSTANTS.TemplateWidth; i++) {
                bob_1.BOBAPI.Load_Frame_BOB16(tileSetBOB, imageData, counter, i, j);
                counter++;
            }
        }
        return tileSetBOB;
    }
    function loadObjectsBOB() {
        let bob = bob_1.BOBAPI.Create_BOB(0, 0, 40, 40, 15);
        let image = exports.DATA.images.Objects;
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 0, 0, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 1, 1, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 2, 2, 0);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 3, 0, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 4, 1, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 5, 2, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 6, 3, 1);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 7, 0, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 8, 1, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 9, 2, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 10, 3, 2);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 11, 0, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 12, 1, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 13, 2, 3);
        bob_1.BOBAPI.Load_Frame_BOB16(bob, image, 14, 3, 3);
        return bob;
    }
});
//# sourceMappingURL=data.js.map