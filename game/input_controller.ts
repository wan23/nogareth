import * as Nipple from './nipplejs';

//Input Controller API's to help with
//keyboard and gamepad processing events

declare var navigator, $;

export class GamePadState{
    buttonDown:boolean = false;
    buttonNum:number = -1;
    buttonTimer = 0;
    keyName:string = '';
    

    constructor(buttonNum:number,keyName:string) {
        this.buttonNum = buttonNum;
        this.keyName = keyName;
    }

}

export class KeyMappings{
    Mapping_Left:string = null;
    Mapping_Right:string = null;
    Mapping_Up:string = null;
    Mapping_Down:string = null;
    Mapping_Action_1:string = null;
    Mapping_Action_2:string = null;
    Mapping_Action_3:string = null;
    Mapping_Action_4:string = null;
    Mapping_Action_5:string = null;
    Mapping_Action_6:string = null;
    Mapping_Action_7:string = null;
    Mapping_Start:string = null;
    Mapping_Select:string = null;
}

export class InputController{

    gamepadButtons:GamePadState[] = [];

    Key_Up=false;
    Key_Down=false;
    Key_Left=false;
    Key_Right=false;
    Key_Action_1=false;
    Key_Action_2=false;
    Key_Action_3=false;
    Key_Action_4=false;
    Key_Action_5=false;
    Key_Action_6=false;
    Key_Action_7=false;

    Key_Start = false;
    Key_Select = false;
    Gamepad_Process_Axis = false;
    GamepadHorizontalAccess:number = 0;
    GamepadVerticalAccess:number = 0;
    Touch_Tap = false;
    KeyMappings: KeyMappings;
    DebugKeycodes = false;
    LastKey: string = '';
    LastGameButton: string = '';
    GamepadDetails: string = '';

    //keypress
    private _last_key_press:string = null;
    KEY_PRESS:string = null;

    //mobile buttons
    Mobile1=false; 
    Mobile2=false; 
    MobileStart=false; 
    MobileSelect=false; 

    //touch
    private touchX_Start:number = 0;
    private touchY_Start:number = 0;
    private touch_tap_counter = 0;

    //NippleJS
    manager: any;
    nippleDirection:string = 'none';

    constructor(touch_element_id?:string,touch_exclude_id?:string){
        window["inputController"] = this;
        


        if (touch_element_id)
        {
            //you have to do this if the main element
            //takes up the whole screen other html buttons won't work
            //see Tetris JS Implementation
            if (touch_exclude_id){
                document.getElementById(touch_exclude_id).addEventListener( 'touchstart', function(e){e.stopPropagation();}, false );
                document.getElementById(touch_exclude_id).addEventListener( 'touchend', function(e){ e.stopPropagation();}, false );
            }

            this.manager = Nipple.create({
                zone: document.getElementById(touch_element_id),
                color: 'blue',
                mode: "dynamic",
            });
    
            this.manager.on("move", (evt, data) => {
                // console.log(evt,data);
                if (data.force > 1) {
                    if (data.direction)
                        this.nippleDirection = data.direction.angle;
                    
                    //first reset all touch directions back to false
                    this.Key_Left = false;
                    this.Key_Right = false;
                    this.Key_Up = false;
                    this.Key_Down = false;
                    
                    if (this.nippleDirection=='left')   this.Key_Left=true;
                    if (this.nippleDirection=='right')   this.Key_Right=true;
                    if (this.nippleDirection=='up')   this.Key_Up=true;
                    if (this.nippleDirection=='down')   this.Key_Down=true;
                    }
                else {
                    this.nippleDirection = 'none';
                    this.Key_Left = false;
                    this.Key_Right = false;
                    this.Key_Up = false;
                    this.Key_Down = false;
                }
            })
    
            this.manager.on("end", (evt, data) => {
                this.nippleDirection = 'none';
                this.Key_Left = false;
                this.Key_Right = false;
                this.Key_Up = false;
                this.Key_Down = false;
            })

            //needed in conjuction with nippleJS otherwise iOS text selection will activate
            document.getElementById(touch_element_id).addEventListener( 'touchstart', function(e){e.preventDefault();}, false );
            document.getElementById(touch_element_id).addEventListener( 'touchend', function(e){e.preventDefault();}, false );
            document.getElementById(touch_element_id).addEventListener( 'touchmove', function(e){e.preventDefault();}, false );

            // document.getElementById('mobile1').addEventListener( 'touchstart', this.mobilePressA.bind(this), false );
            // document.getElementById('mobile2').addEventListener( 'touchstart', this.mobilePressB.bind(this), false );
            document.getElementById('mobileStart').addEventListener( 'touchstart', this.mobilePressStart.bind(this), false );
            document.getElementById('mobileSelect').addEventListener( 'touchstart', this.mobilePressSelect.bind(this), false );
            // document.getElementById('mobile1').addEventListener( 'touchend', this.mobileReleaseA.bind(this), false );
            // document.getElementById('mobile2').addEventListener( 'touchend', this.mobileReleaseB.bind(this), false );
            document.getElementById('mobileStart').addEventListener( 'touchend', this.mobileReleaseStart.bind(this), false );
            document.getElementById('mobileSelect').addEventListener( 'touchend', this.mobileReleaseSelect.bind(this), false );
            // document.getElementById('mobile1').addEventListener( 'touchmove', function(e){e.preventDefault();}, false );
            // document.getElementById('mobile2').addEventListener( 'touchmove', function(e){e.preventDefault();}, false );
            document.getElementById('mobileStart').addEventListener( 'touchmove', function(e){e.preventDefault();}, false );
            document.getElementById('mobileSelect').addEventListener( 'touchmove', function(e){e.preventDefault();}, false );

            //to hide and show loading panel
            document.getElementById('menuDiv').addEventListener( 'touchstart', this.canvasTouch.bind(this), false );

        }

        this.KeyMappings = {
            Mapping_Left:'ArrowLeft',
            Mapping_Right:'ArrowRight',
            Mapping_Up:'ArrowUp',
            Mapping_Down:'ArrowDown',
            Mapping_Action_1:'a',
            Mapping_Action_2:'s',
            Mapping_Action_3:'z',
            Mapping_Action_4:'x',
            Mapping_Action_5:'q',
            Mapping_Action_6:'w',
            Mapping_Action_7:'w',
            Mapping_Start:'p',
            Mapping_Select:'n'
        }
        

        //only for HTML5 Canvas
        //document.addEventListener( 'wheel', this.prevent, false );
        //document.addEventListener( 'contextmenu', this.prevent, false );

        document.onkeydown = this.keyDown; 
        document.onkeyup = this.keyUp;

        console.log('InputController Initialized');
    }

    canvasTouch(event:TouchEvent){
        if (event.touches[0].clientY<50)
            $("#divMain").show();
        $('#menuDiv').hide();
    }

    mobilePressA(event){
        event.preventDefault();
        this.Key_Action_1 = true;
        this.Mobile1 = true;
    }
    mobilePressB(event){
        event.preventDefault();
        this.Key_Action_2 = true;
        this.Mobile2 = true;
    }
    mobilePressStart(event){
        event.preventDefault();
        this.Key_Start = true;
        this.MobileStart = true;
    }
    mobilePressSelect(event){
        event.preventDefault();
        this.Key_Select = true;
        this.MobileSelect = true;
    }
    mobileReleaseA(event){
        event.preventDefault();
        this.Mobile1 = false;
        this.Key_Action_1 = false;
    }
    mobileReleaseB(event){
        event.preventDefault();
        this.Mobile2 = false;
        this.Key_Action_2 = false;
    }
    mobileReleaseStart(event){
        event.preventDefault();
        this.MobileStart = false;
        this.Key_Start = false;
    }
    mobileReleaseSelect(event){
        event.preventDefault();
        this.MobileSelect = false; 
        this.Key_Select = false;
        this._last_key_press="p";
    }

    setupGamePad(){
        window.addEventListener("gamepadconnected", this.initGamePad.bind(this));
        this.gamepadButtons.push(new GamePadState(14,this.KeyMappings.Mapping_Left));
        this.gamepadButtons.push(new GamePadState(15,this.KeyMappings.Mapping_Right));
        this.gamepadButtons.push(new GamePadState(13,this.KeyMappings.Mapping_Down));
        this.gamepadButtons.push(new GamePadState(12,this.KeyMappings.Mapping_Up));
        // this.gamepadButtons.push(new GamePadState(0,this.KeyMappings.Mapping_Action_1));
        // this.gamepadButtons.push(new GamePadState(1,this.KeyMappings.Mapping_Action_2));
        // this.gamepadButtons.push(new GamePadState(2,this.KeyMappings.Mapping_Action_3));
        // this.gamepadButtons.push(new GamePadState(3,this.KeyMappings.Mapping_Action_4));
        // this.gamepadButtons.push(new GamePadState(4,this.KeyMappings.Mapping_Action_5));
        // this.gamepadButtons.push(new GamePadState(5,this.KeyMappings.Mapping_Action_6));
        this.gamepadButtons.push(new GamePadState(9,this.KeyMappings.Mapping_Start));
        this.gamepadButtons.push(new GamePadState(8,this.KeyMappings.Mapping_Select));
    }

    private initGamePad(e)
    {
        try{
            if (e.gamepad.buttons.length>0)
            {
                // this.message = '<b>Gamepad Detected:</b><br>' + e.gamepad.id;
            }
        }catch{}

            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
              e.gamepad.index, e.gamepad.id,
              e.gamepad.buttons.length, e.gamepad.axes.length);

              let input_controller = window["inputController"] as InputController;
              input_controller.GamepadDetails = 'Gamepad connected at index ' + e.gamepad.index 
                + ' ID:' + e.gamepad.id + ' Buttons: ' + e.gamepad.buttons.length + ' Axes: ' + e.gamepad.axes.length;
    }


    processGamepad(){
        try{
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            if (!gamepads)
              return;
            var gp = null;
            for (let i=0;i<gamepads.length;i++) 
            {
                if (gamepads[i] && gamepads[i].buttons.length>0)
                    gp = gamepads[i];
            }
                

            if (gp)
            {
                for (let i = 0; i < gp.buttons.length; i++) {

                    if (gp.buttons[i].pressed) {
                        if (this.DebugKeycodes) {
                            console.log('Gamepad Button: ' + i);
                        }
                        this.LastGameButton = i.toString();
                    }

                }
                this.gamepadButtons.forEach(button => {

                    if (gp.buttons[button.buttonNum].pressed)
                    {
                        if (button.buttonTimer==0)
                        {
                            this.sendKeyDownEvent(button.keyName);
                        }   
                        button.buttonDown = true;
                        button.buttonTimer++;
                    }
                    else if (button.buttonDown)
                    {
                        if (!gp.buttons[button.buttonNum].pressed)
                        {
                            button.buttonDown = false;
                            button.buttonTimer = 0;
                            this.sendKeyUpEvent(button.keyName);
                        }
                    }


                });  
                

                //process axes
                if (this.Gamepad_Process_Axis)
                {
                    try
                    {
                        // console.log('axis count: ' + gp.axes.length);
                        // var axisString = '';
                        // gp.axes.forEach(axis => {
                        //     axisString += axis + ', ';
                        // });
                        // console.log('axis state: ' + axisString);

                        let horiz_axis = gp.axes[0] as number;
                        let vertical_axis = gp.axes[1] as number;
                        this.GamepadHorizontalAccess = horiz_axis;
                        this.GamepadVerticalAccess = vertical_axis;
    
                        if (horiz_axis<-.5)
                            this.Key_Left = true;
                        else
                            this.Key_Left = false;
    
                        if (horiz_axis>.5)
                            this.Key_Right = true;
                        else
                            this.Key_Right = false;
    
                        if (vertical_axis<-.5)
                            this.Key_Down = true;
                        else
                            this.Key_Down = false;
    
                        if (vertical_axis>.5)
                            this.Key_Up = true;
                        else
                            this.Key_Up = false;
    
                    }catch(error){}
                }


            }
                

        }catch{}
    }

    sendKeyDownEvent(key:string)
    {
        let keyEvent = new KeyboardEvent('Gamepad Event Down',{key:key});
        this.keyDown(keyEvent);
    }

    sendKeyUpEvent(key:string)
    {
        let keyEvent = new KeyboardEvent('Gamepad Event Up',{key:key});
        this.keyUp(keyEvent);
    }

    keyDown(event:KeyboardEvent)
    {
        
        let input_controller = window["inputController"] as InputController;
        if (input_controller.DebugKeycodes)
            console.log(event);
        
        input_controller.LastKey = event.key;
        
        //handle certain keyboards that use Left instead of ArrowLeft
        if (event.key=='Left' && input_controller.KeyMappings.Mapping_Left=='ArrowLeft') event = new KeyboardEvent('',{key:'ArrowLeft'});
        if (event.key=='Right' && input_controller.KeyMappings.Mapping_Right=='ArrowRight') event = new KeyboardEvent('',{key:'ArrowRight'});
        if (event.key=='Up' && input_controller.KeyMappings.Mapping_Up=='ArrowUp') event = new KeyboardEvent('',{key:'ArrowUp'});
        if (event.key=='Down' && input_controller.KeyMappings.Mapping_Down=='ArrowDown') event = new KeyboardEvent('',{key:'ArrowDown'});

        if (event.key==input_controller.KeyMappings.Mapping_Down)
        {
            input_controller.Key_Down = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Up)
        {
            input_controller.Key_Up = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Left)
        {
            input_controller.Key_Left = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Right)
        {
            input_controller.Key_Right = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_1)
        {
            input_controller.Key_Action_1 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_2)
        {
            input_controller.Key_Action_2 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_3)
        {
            input_controller.Key_Action_3 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_4)
        {
            input_controller.Key_Action_4 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_5)
        {
            input_controller.Key_Action_5 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_6)
        {
            input_controller.Key_Action_6 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_7)
        {
            input_controller.Key_Action_7 = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Start)
        {
            input_controller.Key_Start = true;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Select)
        {
            input_controller.Key_Select = true;
        }
        
    }

    keyUp(event:KeyboardEvent)
    {
        let input_controller = window["inputController"] as InputController;

        //handle certain keyboards that use Left instead of ArrowLeft
        if (event.key=='Left' && input_controller.KeyMappings.Mapping_Left=='ArrowLeft') event = new KeyboardEvent('',{key:'ArrowLeft'});
        if (event.key=='Right' && input_controller.KeyMappings.Mapping_Right=='ArrowRight') event = new KeyboardEvent('',{key:'ArrowRight'});
        if (event.key=='Up' && input_controller.KeyMappings.Mapping_Up=='ArrowUp') event = new KeyboardEvent('',{key:'ArrowUp'});
        if (event.key=='Down' && input_controller.KeyMappings.Mapping_Down=='ArrowDown') event = new KeyboardEvent('',{key:'ArrowDown'});

        if (event.key==input_controller.KeyMappings.Mapping_Down)
        {
            input_controller.Key_Down = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Up)
        {
            input_controller.Key_Up = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Left)
        {
            input_controller.Key_Left = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Right)
        {
            input_controller.Key_Right = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_1)
        {
            input_controller.Key_Action_1 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_2)
        {
            input_controller.Key_Action_2 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_3)
        {
            input_controller.Key_Action_3 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_4)
        {
            input_controller.Key_Action_4 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_5)
        {
            input_controller.Key_Action_5 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_6)
        {
            input_controller.Key_Action_6 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Action_7)
        {
            input_controller.Key_Action_7 = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Start)
        {
            input_controller.Key_Start = false;
        }
        if (event.key==input_controller.KeyMappings.Mapping_Select)
        {
            input_controller.Key_Select = false;
        }

        input_controller._last_key_press = event.key;
    }

    prevent(event){
        event.preventDefault();
        event.stopPropagation();
    }

    touchStart(event:TouchEvent){
        event.preventDefault();
        let input_controller = window["inputController"] as InputController;

        input_controller.touchX_Start = event.touches[0].clientX;
        input_controller.touchY_Start = event.touches[0].clientY;
    }

    touchMove(event:TouchEvent){
        event.preventDefault();
        let input_controller = window["inputController"] as InputController;

        var amount_horizontal = event.touches[0].clientX-input_controller.touchX_Start;
        var amount_vertical = event.touches[0].clientY-input_controller.touchY_Start;
        
        if (amount_horizontal>10)
            input_controller.Key_Right=true;
        if (amount_horizontal<-10)
            input_controller.Key_Left=true;
        if (amount_vertical>10)
            input_controller.Key_Down=true;
        if (amount_vertical<-10)
            input_controller.Key_Up=true;
    }


    touchEnd(event:TouchEvent){
        event.preventDefault();
        event.stopPropagation();

        let input_controller = window["inputController"] as InputController;

        if (input_controller.Key_Left==false && input_controller.Key_Right==false 
            && input_controller.Key_Down==false && input_controller.Key_Up==false)
            input_controller.Touch_Tap=true;
        input_controller.Key_Left=false;
        input_controller.Key_Right=false;
        input_controller.Key_Up=false;
        input_controller.Key_Down=false;
    }

    mouseUp(event){
        event.preventDefault();
        // window["myApp"].isMouseDown = false;
    }

    mouseDown(event:MouseEvent){
        event.preventDefault();
        // window["myApp"].isMouseDown = true;
    }

    mouseMove(event:MouseEvent){
        event.preventDefault();
        //TODO

        // let app = window["myApp"] as MyApp;
        // if (app.isMouseDown)
        // {
        //     app.camera.position.x += event.movementX;
        //     app.camera.position.z += event.movementY;
        // }
    }

    update(){
        this.processGamepad();
        if (this.Touch_Tap)
            this.touch_tap_counter++;
        if (this.touch_tap_counter>1)
        {
            this.Touch_Tap = false;
            this.touch_tap_counter = 0;
        }

        //make sure keypress lasts for exactly 1 frame
        if (this.KEY_PRESS)
            this.KEY_PRESS=null;
        if (this._last_key_press){
            this.KEY_PRESS = this._last_key_press;
            this._last_key_press = null;
        }
    }

    loop(){
        this.update();
		window.requestAnimationFrame(this.loop.bind(this));
	}
}