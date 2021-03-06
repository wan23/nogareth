import { InputController } from "./input_controller";
import { NoGarethGame } from "./nogarethgame";
import { DATA, SOUND_FILES } from "./data";
import { BOBAPI } from "./bob";

declare var window,rivets,$, Tone;

export class MyApp {

    message:string = '';
    ctx:CanvasRenderingContext2D;
	canvas:HTMLCanvasElement;
    nogarethGame:NoGarethGame;
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

        this.detectMobile();
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
            Tone.context.resume();
            BOBAPI.LoadAllSounds();

            

            if (this.mobileMode) {
                $("#mobileDiv").show();
                $('#my-canvas').width(window.innerWidth);
                $('#my-canvas').appendTo("#mobileCanvas");
                $("#my-canvas").show();
                $("#divMain").hide();
                $("#btnHideMenu").show();
                
                
                let halfWidth = (window.innerWidth / 2) - 35;
                document.getElementById("menuDiv").style.left = halfWidth + "px";
                this.inputController = new InputController('divTouchSurface');
    
                //scroll back to top
                try
                {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }catch(error){}
                
    
            }
            else {
                $("#btnFullScreen").show();
                $("#my-canvas").show();
                $("#divGithub").show();
                this.inputController = new InputController();
            }
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

            
            this.nogarethGame = new NoGarethGame(this.ctx, this.inputController);

            //setup animation loop
            window.requestAnimationFrame(this.draw.bind(this));
            this.firstTimeLoad = false;
        }
        else{
            this.nogarethGame = new NoGarethGame(this.ctx, this.inputController);
            if (this.mobileMode)
                this.btnHideMenu();
        }

        $("#btnPlayGame").hide();
    }


    draw(timestamp:DOMHighResTimeStamp){
		window.requestAnimationFrame(this.draw.bind(this));

        if (timestamp - this.lastFrameTime >= 1000 / this.fps) {
         
            if (this.nogarethGame) {
                this.nogarethGame.Game_Main();
                this.lastFrameTime = performance.now()
            }
        }
        
    }

    detectMobile(){
        if (window.innerWidth < 600 || navigator.userAgent.toLocaleLowerCase().toLocaleLowerCase().includes('iphone') ||
            navigator.userAgent.toLocaleLowerCase().toLocaleLowerCase().includes('ipad') ) {
            this.mobileMode = true;
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