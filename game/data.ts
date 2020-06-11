
import { BOBAPI } from "./bob";
import { Player } from "./player";
import { NoGarethGame } from "./nogarethgame";
import { InputController } from "./input_controller";


async function loadAsyncData(){
    DATA.levels.MikeLevel = await loadLevel('/game/data/levels/mikeslevel.txt');
    DATA.levels.Juanlevel = await loadLevel('/game/data/levels/juanlevel.txt');
    DATA.levels.NeilLevel = await loadLevel('/game/data/levels/neallevel.txt');
}

function loadData() {
    var data = {
        images: {
            Gareth: loadSpriteSheet('/game/data/images/Gareth copy.png'),
            GreyZombie: loadSpriteSheet('/game/data/images/greyZombie.png'),
            RedZombie: loadSpriteSheet('/game/data/images/redZombie.png'),
            Sluggo: loadSpriteSheet('/game/data/images/Slugo.png'),
            Objects: loadSpriteSheet('/game/data/images/objects.png'),
            // Tilesets
            MikeTileSet: loadSpriteSheet('/game/data/images/mikeTileTemplate.bmp'),
            NeilTileSet: loadSpriteSheet('/game/data/images/nealTileTemplate.bmp'),
            JuanTileSet: loadSpriteSheet('/game/data/images/juanTileTemplate.bmp'),

            // Overlays
            KeysOverlay:  loadSpriteSheet('/game/data/images/Keys.bmp'),
            LifeOverlay: loadSpriteSheet('/game/data/images/Life.bmp'),
            DarknessOverlay: loadSpriteSheet('/game/data/images/darkness.png'),

            // Game Screens
            IntroMenu:  loadSpriteSheet('/game/data/images/introMenu.bmp'),
            PauseScreen: loadSpriteSheet('/game/data/images/pauseScreen.bmp'),
            GameOver: loadSpriteSheet('/game/data/images/gameOver.bmp'),
            About:  loadSpriteSheet('/game/data/images/about.bmp'),
            Help: loadSpriteSheet('/game/data/images/help.bmp'),
            Win: loadSpriteSheet('/game/data/images/win.bmp'),
        },
        // Note: These are promises that return the complete text of the file as a string
        // To use: e.g. DATA.levels.MikeLevel.then(callback function)
        levels: {
            MikeLevel: '',
            Juanlevel: '',
            NeilLevel: ''
        },
        sounds: {

        },
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

        MikeLevelTileSet: loadLevelBOB(DATA.images.MikeTileSet),
        NeilLevelTileSet: loadLevelBOB(DATA.images.NeilTileSet),
        JuanLevelTileSet: loadLevelBOB(DATA.images.JuanTileSet),
        ObjectSet: loadObjectsBOB(),
        GameScreens: loadGameScreensBOB(),
        KeyOverlay: loadKeysBob(),
        LifeOverlay: loadLifeOverlayBOB(),
        DarknessOverlay: loadDarknessBOB(),
    };
    return bobs;
}

function loadSpriteSheet(url: string) {
    let img = new Image();
    img.src = url;
    return img;
}

//only use this internally in data.ts
async function loadLevel(url: string) {
    let response = await fetch(url);
    return await response.text();
}

export const CONSTANTS = {
    TemplateHeight: 35,
    TemplateWidth: 4,
    NumFrames: 35 * 4,
    NumObjects: 15,         // The number of objects that exist
    StartX: 13 * 40,        //starting position of player on mike's level
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
        Up:	 2,
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
}

export const DATA = loadData();
export const ALL_BOBS = loadBOBs();
export var CANVAS:CanvasRenderingContext2D = null;
export var PLAYER:Player = null;
export var GAME:NoGarethGame = null;
export var INPUTCONTROLLER:InputController = null;

export function setCanvas(ctx: CanvasRenderingContext2D) {
    CANVAS = ctx;
}
export function setPlayer(player: Player) {
    PLAYER = player;
}

export function setGame(game: NoGarethGame) {
    GAME = game;
}

export function setInputController(InputController: InputController) {
    INPUTCONTROLLER = InputController;
}

export const MUSIC_FILES = [
    // TODO: The first three slots are unused.
    "/game/data/music/WinCredits.mp3",
    "/game/data/music/WinCredits.mp3",
    "/game/data/music/WinCredits.mp3",
    "/game/data/music/ItFollows.mp3", //level 2
    "/game/data/music/Ominous.mp3", //level 3
    "/game/data/music/WhereAmI.mp3", //level 1
    "/game/data/music/WinCredits.mp3",
    "/game/data/music/MoveQuick.mp3",
]

export const SOUND_FILES = [
    "/game/data/sounds/laugh.wav",
    "/game/data/sounds/Bounced.wav",
    "/game/data/sounds/Footsteps.wav",
    "/game/data/sounds/messagebox.wav",
    "/game/data/sounds/falling.wav",
    "/game/data/sounds/ZombieSound.wav",
    "/game/data/sounds/Door Big Close.wav",
    "/game/data/sounds/Breaker Switch 1.wav",
    "/game/data/sounds/evillaugh.wav",
    "/game/data/sounds/ZombieFalling.wav",
    "/game/data/sounds/ZombieLostThePlayer.wav",
    "/game/data/sounds/keys.wav",
]

/**
 * @param  {number} exclusiveMaxValue Will be less than this value
 * @returns Random Integer
 * 
 * example GetRandom(10) returns 0-9
 */
export function GetRandom(exclusiveMaxValue:number):number{
    return Math.floor(Math.random() * exclusiveMaxValue); 
}

// BOB Loading

function loadGarethBOB () {
    let garethBob = BOBAPI.Create_BOB(0,0,26,40,15);
    let garethImage = DATA.images.Gareth;
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,0,0,0);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,1,1,0);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,2,2,0);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,3,0,1);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,4,1,1);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,5,2,1);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,6,0,2);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,7,1,2);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,8,2,2);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,9,0,3);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,10,1,3);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,11,2,3);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,12,0,4);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,13,1,4);
    BOBAPI.Load_Frame_BOB16(garethBob, garethImage,14,2,4);
    return garethBob;
}

function loadLifeOverlayBOB() {
    let  lifeOverlay = BOBAPI.Create_BOB(0,0,176,28,1)
	let lifeImage = DATA.images.LifeOverlay;
 
    BOBAPI.Load_Frame_BOB16(lifeOverlay, lifeImage,0,0,0, false);
    return lifeOverlay;
}

function loadDarknessBOB() {
    let darknessOverlay = BOBAPI.Create_BOB(0,0,640,480,1)
	let darknessImage = DATA.images.DarknessOverlay;
 
    BOBAPI.Load_Frame_BOB16(darknessOverlay, darknessImage,0,0,0, false);
    return darknessOverlay;
}


function loadKeysBob() {
    let keysOverlay = BOBAPI.Create_BOB(0,0,100,28,1)
	let keysImage = DATA.images.KeysOverlay;
 
    BOBAPI.Load_Frame_BOB16(keysOverlay, keysImage,0,0,0, false);
    return keysOverlay;
}

function loadGameScreensBOB() {
    let bob = BOBAPI.Create_BOB(0,0,640,480,6);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.IntroMenu,0,0,0, false);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.PauseScreen,1,0,0, false);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.GameOver,2,0,0, false);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.About,3,0,0, false);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.Help,4,0,0, false);
    BOBAPI.Load_Frame_BOB16(bob, DATA.images.Win,5,0,0, false);
    return bob;

}

function loadGreyZombieBOB () {
    let bob = BOBAPI.Create_BOB(0,0,30,40,15);
    let image = DATA.images.GreyZombie;
    BOBAPI.Load_Frame_BOB16(bob, image,0,0,0);
    BOBAPI.Load_Frame_BOB16(bob, image,1,1,0);
    BOBAPI.Load_Frame_BOB16(bob, image,2,2,0);
    BOBAPI.Load_Frame_BOB16(bob, image,3,0,1);
    BOBAPI.Load_Frame_BOB16(bob, image,4,1,1);
    BOBAPI.Load_Frame_BOB16(bob, image,5,2,1);
    BOBAPI.Load_Frame_BOB16(bob, image,6,0,2);
    BOBAPI.Load_Frame_BOB16(bob, image,7,1,2);
    BOBAPI.Load_Frame_BOB16(bob, image,8,2,2);
    BOBAPI.Load_Frame_BOB16(bob, image,9,0,3);
    BOBAPI.Load_Frame_BOB16(bob, image,10,1,3);
    BOBAPI.Load_Frame_BOB16(bob, image,11,2,3);
    BOBAPI.Load_Frame_BOB16(bob, image,12,0,4);
    BOBAPI.Load_Frame_BOB16(bob, image,13,1,4);
    BOBAPI.Load_Frame_BOB16(bob, image,14,2,4);
    return bob;
}

function loadRedZombieBOB () {
    let bob = BOBAPI.Create_BOB(0,0,30,40,15);
    let image = DATA.images.RedZombie;
    BOBAPI.Load_Frame_BOB16(bob, image,0,0,0);
    BOBAPI.Load_Frame_BOB16(bob, image,1,1,0);
    BOBAPI.Load_Frame_BOB16(bob, image,2,2,0);
    BOBAPI.Load_Frame_BOB16(bob, image,3,0,1);
    BOBAPI.Load_Frame_BOB16(bob, image,4,1,1);
    BOBAPI.Load_Frame_BOB16(bob, image,5,2,1);
    BOBAPI.Load_Frame_BOB16(bob, image,6,0,2);
    BOBAPI.Load_Frame_BOB16(bob, image,7,1,2);
    BOBAPI.Load_Frame_BOB16(bob, image,8,2,2);
    BOBAPI.Load_Frame_BOB16(bob, image,9,0,3);
    BOBAPI.Load_Frame_BOB16(bob, image,10,1,3);
    BOBAPI.Load_Frame_BOB16(bob, image,11,2,3);
    BOBAPI.Load_Frame_BOB16(bob, image,12,0,4);
    BOBAPI.Load_Frame_BOB16(bob, image,13,1,4);
    BOBAPI.Load_Frame_BOB16(bob, image,14,2,4);
    return bob;
}

function loadSluggoBOB () {
    let bob = BOBAPI.Create_BOB(0,0,28,40,12);
    let image = DATA.images.Sluggo;
    BOBAPI.Load_Frame_BOB16(bob, image,0,0,0);
    BOBAPI.Load_Frame_BOB16(bob, image,1,1,0);
    BOBAPI.Load_Frame_BOB16(bob, image,2,2,0);
    BOBAPI.Load_Frame_BOB16(bob, image,3,0,1);
    BOBAPI.Load_Frame_BOB16(bob, image,4,1,1);
    BOBAPI.Load_Frame_BOB16(bob, image,5,2,1);
    BOBAPI.Load_Frame_BOB16(bob, image,6,0,2);
    BOBAPI.Load_Frame_BOB16(bob, image,7,1,2);
    BOBAPI.Load_Frame_BOB16(bob, image,8,2,2);
    BOBAPI.Load_Frame_BOB16(bob, image,9,0,3);
    BOBAPI.Load_Frame_BOB16(bob, image,10,1,3);
    BOBAPI.Load_Frame_BOB16(bob, image,11,2,3);
    return bob;
}

function loadLevelBOB(imageData:HTMLImageElement) {
    let tileSetBOB = BOBAPI.Create_BOB(0,0,40,40,CONSTANTS.NumFrames);

    var counter = 0;
	for (var j=0;j<CONSTANTS.TemplateHeight;j++)
	{	
		for (var i =0;i<CONSTANTS.TemplateWidth;i++)
		{
		BOBAPI.Load_Frame_BOB16(tileSetBOB,imageData,counter,i,j);
		counter++;
		}
    }
    return tileSetBOB;
}

function loadObjectsBOB(){
    let bob = BOBAPI.Create_BOB(0,0,40,40,15);
    let image = DATA.images.Objects;
    BOBAPI.Load_Frame_BOB16(bob, image,0,0,0);
    BOBAPI.Load_Frame_BOB16(bob, image,1,1,0);
    BOBAPI.Load_Frame_BOB16(bob, image,2,2,0);
    BOBAPI.Load_Frame_BOB16(bob, image,3,0,1);
    BOBAPI.Load_Frame_BOB16(bob, image,4,1,1);
    BOBAPI.Load_Frame_BOB16(bob, image,5,2,1);
    BOBAPI.Load_Frame_BOB16(bob, image,6,3,1);
    BOBAPI.Load_Frame_BOB16(bob, image,7,0,2);
    BOBAPI.Load_Frame_BOB16(bob, image,8,1,2);
    BOBAPI.Load_Frame_BOB16(bob, image,9,2,2);
    BOBAPI.Load_Frame_BOB16(bob, image,10,3,2);
    BOBAPI.Load_Frame_BOB16(bob, image,11,0,3);
    BOBAPI.Load_Frame_BOB16(bob, image,12,1,3);
    BOBAPI.Load_Frame_BOB16(bob, image,13,2,3);
    BOBAPI.Load_Frame_BOB16(bob, image,14,3,3);
    return bob;
    
}
