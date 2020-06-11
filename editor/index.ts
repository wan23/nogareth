import { InputController } from "../game/input_controller";
import { DATA, SOUND_FILES } from "../game/data";
import { BOBAPI } from "../game/bob";
import { NoGarethEditor } from "./nogaretheditor";

declare var window,rivets,$, Tone;

export class MyApp {

    nogarethEditor: NoGarethEditor;
    message:string = '';
    ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;

    inputController:InputController;
    _data = DATA; //for debugging
    _bobapi = BOBAPI; //for debugging
    mobileMode: boolean = false;
    firstTimeLoad: boolean = true;
    lastFrameTime:DOMHighResTimeStamp = 0;
    fps:number = 45;

    constructor() {

        //rivets is a handy data binding library for html front ends
        this.bindRivets();

        //setup canvas
        this.canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.load();
    }

    async load(){

        //load game files
        await DATA.LoadAsync();
        $('#divLoading').hide();
        $('#divMain').show();
    }

    //callback after all sounds finish loading
    //current not being used because loadAllSounds
    //needs to run after a button click
    finishedLoading(){

    }

    bindRivets(){
        rivets.bind($('body'), {data:this});
    }
    
    btnClick(){
        if (this.firstTimeLoad){

            //get audio working after user interaction
            //Tone.context.resume();
            //BOBAPI.LoadAllSounds();

            $("#btnFullScreen").show();
            $("#my-canvas").show();
            this.inputController = new InputController('my-canvas');
            
            this.inputController.KeyMappings = {
                Mapping_Left:'ArrowLeft',
                Mapping_Right:'ArrowRight',
                Mapping_Up:'ArrowUp',
                Mapping_Down:'ArrowDown',
                Mapping_Action_1:'a',
                Mapping_Action_2:'s',
                Mapping_Action_3:'z',
                Mapping_Action_4:'x',
                Mapping_Action_5:'d',
                Mapping_Action_6:'c',
                Mapping_Action_7:'f',
                Mapping_Start:'Enter',
                Mapping_Select:'Shift'
            };
            this.inputController.setupGamePad();

            
            this.nogarethEditor = new NoGarethEditor(this.ctx, this.inputController);
            this.nogarethEditor.load_level("Levels/mikeslevel.txt");
            //setup animation loop
            window.requestAnimationFrame(this.draw.bind(this));
            this.firstTimeLoad = false;
        }
        else{
            this.nogarethEditor = new NoGarethEditor(this.ctx, this.inputController);
            if (this.mobileMode)
                this.btnHideMenu();
        }

        $("#btnPlayGame").hide();
    }


    draw(timestamp:DOMHighResTimeStamp){
		window.requestAnimationFrame(this.draw.bind(this));

        if (timestamp - this.lastFrameTime >= 1000 / this.fps) {
         
            if (this.nogarethEditor) {
                this.nogarethEditor.Editor_Main();
                this.lastFrameTime = performance.now()
            }
        }
        
    }
    
    btnHideMenu() {
        $('#divMain').hide();
        $('#menuDiv').show();
    }

    btnFullScreen(){
        this.canvas.requestFullscreen();
    }

}

window.myApp = new MyApp();