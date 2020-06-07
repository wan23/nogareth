var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./input_controller", "./nogarethgame", "./data", "./bob"], function (require, exports, input_controller_1, nogarethgame_1, data_1, bob_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyApp = void 0;
    class MyApp {
        constructor() {
            this.message = '';
            this._data = data_1.DATA; //for debugging
            this._bobapi = bob_1.BOBAPI; //for debugging
            this.mobileMode = false;
            this.firstTimeLoad = true;
            this.lastFrameTime = 0;
            this.fps = 45;
            //rivets is a handy data binding library for html front ends
            this.bindRivets();
            //setup canvas
            this.canvas = document.getElementById('my-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.detectMobile();
            this.load();
        }
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                //load game files
                yield data_1.DATA.LoadAsync();
                $('#divLoading').hide();
                $('#divMain').show();
            });
        }
        //callback after all sounds finish loading
        //current not being used because loadAllSounds
        //needs to run after a button click
        finishedLoading() {
        }
        bindRivets() {
            rivets.bind($('body'), { data: this });
        }
        btnClick() {
            if (this.firstTimeLoad) {
                //get audio working after user interaction
                Tone.context.resume();
                bob_1.BOBAPI.LoadAllSounds();
                if (this.mobileMode) {
                    $("#mobileDiv").show();
                    $('#my-canvas').width(window.innerWidth);
                    $('#my-canvas').appendTo("#mobileCanvas");
                    $("#my-canvas").show();
                    $("#divMain").hide();
                    $("#btnHideMenu").show();
                    let halfWidth = (window.innerWidth / 2) - 35;
                    document.getElementById("menuDiv").style.left = halfWidth + "px";
                    this.inputController = new input_controller_1.InputController('divTouchSurface');
                    //scroll back to top
                    try {
                        document.body.scrollTop = 0; // For Safari
                        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                    }
                    catch (error) { }
                }
                else {
                    $("#btnFullScreen").show();
                    $("#my-canvas").show();
                    this.inputController = new input_controller_1.InputController('my-canvas');
                }
                this.inputController.KeyMappings = {
                    Mapping_Left: 'ArrowLeft',
                    Mapping_Right: 'ArrowRight',
                    Mapping_Up: 'ArrowUp',
                    Mapping_Down: 'ArrowDown',
                    Mapping_Action_1: 'a',
                    Mapping_Action_2: 's',
                    Mapping_Action_3: 'z',
                    Mapping_Action_4: 'x',
                    Mapping_Action_5: 'd',
                    Mapping_Action_6: 'c',
                    Mapping_Action_7: 'f',
                    Mapping_Start: 'Enter',
                    Mapping_Select: 'Shift'
                };
                this.inputController.setupGamePad();
                this.nogarethGame = new nogarethgame_1.NoGarethGame(this.ctx, this.inputController);
                //setup animation loop
                window.requestAnimationFrame(this.draw.bind(this));
                this.firstTimeLoad = false;
            }
            else {
                this.nogarethGame = new nogarethgame_1.NoGarethGame(this.ctx, this.inputController);
                if (this.mobileMode)
                    this.btnHideMenu();
            }
            $("#btnPlayGame").hide();
        }
        draw(timestamp) {
            window.requestAnimationFrame(this.draw.bind(this));
            if (timestamp - this.lastFrameTime >= 1000 / this.fps) {
                if (this.nogarethGame) {
                    this.nogarethGame.Game_Main();
                    this.lastFrameTime = performance.now();
                }
            }
        }
        detectMobile() {
            if (window.innerWidth < 600 || navigator.userAgent.toLocaleLowerCase().toLocaleLowerCase().includes('iphone') ||
                navigator.userAgent.toLocaleLowerCase().toLocaleLowerCase().includes('ipad')) {
                this.mobileMode = true;
            }
        }
        btnHideMenu() {
            $('#divMain').hide();
            $('#menuDiv').show();
        }
        btnFullScreen() {
            this.canvas.requestFullscreen();
        }
    }
    exports.MyApp = MyApp;
    window.myApp = new MyApp();
});
//# sourceMappingURL=index.js.map