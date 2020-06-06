//will be a replacement for the old BOB class
//as you come across properties during porting

declare var Tone;

import { CANVAS, CONSTANTS, MUSIC_FILES, SOUND_FILES } from "./data";

//just add them on to the class as needed
export class BOB{
    x:number = 0;
    y:number = 0;
    width:number;
    height:number;
    curr_frame:number = 0;
    numFrames:number;
    img:HTMLImageElement;

    // frame number -> FrameData
    frames = {}

    constructor(width:number, height:number){
        this.width = width;
        this.height = height;
    }

    getCurrentFrameData() : FrameData {
        return this.getFrameData(this.curr_frame)
    }
    getFrameData(frameNumber:number):FrameData{
        return this.frames[frameNumber]
    }
}

class FrameData {
    image:HTMLImageElement;
    top:number;
    left:number;
    width:number;
    height:number;

    constructor(image:HTMLImageElement, left:number, top:number, width:number, height:number){
        this.image = image;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}

//use this to placeholder the BOB API calls
export class BOBAPI{
    static musicPlayer = document.createElement('audio');
    static soundBuffers:{id:number,buffer:AudioBuffer }[] = [];
    static audioContext:AudioContext;

    static Draw_BOB16(bob:BOB){
        let frameData = bob.getCurrentFrameData()
        if (bob.x > CONSTANTS.ScreenWidth ||
            bob.x + bob.width < 0 ||
            bob.y > CONSTANTS.ScreenHeight ||
            bob.y + bob.height < 0) {
                //console.log(`${frameData.left} ${frameData.top} `)
                return;
            }
        CANVAS.drawImage(
            frameData.image,
            frameData.left,
            frameData.top,
            frameData.width,
            frameData.height,
            bob.x,
            bob.y,
            bob.width,   // TODO: Multiply these by global scale factor
            bob.height);
    }

    // Loads a frame from the sprite sheet. Width and height must be set before using this.
    // if mode = BITMAP_EXTRACT_MODE_ABS then set cell_mode = false when calling this
    static Load_Frame_BOB16(bob:BOB, image:HTMLImageElement, frameNumber:number, cx:number, cy:number, cell_mode=true){
        var x:number, y:number;
        if (cell_mode) {
            x = cx*(bob.width+1) + 1;
            y = cy*(bob.height+1) + 1;
        } else {
            x = cx;
            y = cy;
        }
        bob.frames[frameNumber] = new FrameData(image, x, y, bob.width, bob.height)
    }

    static Create_BOB(x:number, y:number, width:number, height:number, numFrames:number):BOB {
        var bob = new BOB(width, height)
        bob.x = x
        bob.y = y
        bob.numFrames = numFrames;
        return bob;
    }


    // The color can be any CSS color string like "#FFFFFF" or "white"
    static Draw_Line16(x1:number, y1:number, x2:number, y2:number, color:string) {
        let ctx = CANVAS;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // The color can be any CSS color string like "#FFFFFF" or "white"
    // This is very inefficient - should set color and then draw all the pixels
    static Draw_Pixel16(x:number, y:number, color:string) {
        let ctx = CANVAS;
        ctx.fillStyle = color;
        ctx.fillRect( x, y, 1, 1 );
    }

    // This should probably be preloading the audio
    static DSound_Play(soundID:number) {
        // var audio = SOUND_FILES[soundID];
        // audio.play();

        // let buffer = new Tone.Buffer(SOUND_FILES[soundID].src, buffer => {
        //     Tone.context.resume();
        //     var soundplayer = new Tone.Player(buffer);
        //     soundplayer.toMaster();
        //     soundplayer.start();
        // });

        BOBAPI.PlaySoundFromBuffer(soundID);

    }

    static DrawText(text:string, x:number, y:number, maxWidth:number, lineHeight:number, color:string) {
        var words = text.split(' ');
        var line = '';

        let context = CANVAS;
        context.fillStyle = color;
        context.font = "16px Verdana,Arial"

        for(var n = 0; n < words.length; n++) {
            var word = words[n];
            if (word == "<break>") {
                context.fillText(line, x, y);
                y += lineHeight;
                line = "";
                continue;
            } else if (word.startsWith("**")) {
                // centered line
                for (n; n < words.length; n++) {
                    word = words[n];
                    line = line + word + " ";
                    if (word.endsWith("**")) {
                        break;
                    }
                }
                var testLine = line + word + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                var offset = 0;
                if (maxWidth - testWidth >= 0) {
                    offset =  maxWidth - testWidth;
                }
                context.fillText(line, x+offset, y);
                line="";
                continue;
            }
            var testLine = line + word + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
      }
    
    
    static DMusic_Play(musicID:number) {
        //call this twice so that current music stops playing immediately
        if (window['player'])
        {
            window['player'].stop();
        }

        let buffer = new Tone.Buffer(MUSIC_FILES[musicID], buffer => {
            Tone.context.resume();
            //call this again just in case before starting new track
            if (window['player'])
            {
                window['player'].stop();
            }
            window['player'] = new Tone.Player(buffer);
            window['player'].toMaster();
            window['player'].loop = true;
            window['player'].start();
            // console.log('player started');
        });
        // console.log('DMusic_play: ' + musicID);

        // BOBAPI.musicPlayer.src = MUSIC_FILES[musicID];
        // BOBAPI.musicPlayer.loop = true;
        // BOBAPI.musicPlayer.play();
        


    }

    static DMusic_Stop(){
        // BOBAPI.musicPlayer.pause();
        if (window['player'])
        {
            window['player'].stop();
        }
    }

    static RGB(r:number, g:number, b:number) : string {
        let toHex = function(n:number) {
            if (n >= 16) {
                return n.toString(16)
            } else {
                return "0" + n.toString()
            }
        }
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    static LoadAllSounds() {

        let audioCtx: AudioContext;
        try {
            audioCtx = new AudioContext();
        } catch (error) {
            try {
                //try for mobile
                audioCtx = new window['webkitAudioContext']();
                console.log('found mobile audio');
            } catch (error2) {
                console.log('could not initialize audio');
            }
        }

        BOBAPI.audioContext = audioCtx;
        audioCtx.resume();

        SOUND_FILES.forEach(sound => {
            // Fetch the sound file from the server
            fetch(sound)
                // Return the data as an ArrayBuffer
                .then(response => response.arrayBuffer())
                // Decode the audio data
                .then(buffer => audioCtx.decodeAudioData(buffer))
                .then(decodedData => {
                    let soundid = 0;
                    for (let i = 0; i < SOUND_FILES.length; i++) {
                        if (SOUND_FILES[i] == sound)
                            soundid = i;
                    }
                    //store it in an audio buffer array for later when needed
                    var soundBuffer = { id: soundid, buffer: decodedData };
                    BOBAPI.soundBuffers.push(soundBuffer);
                    if (BOBAPI.soundBuffers.length == SOUND_FILES.length) {
                        console.log('Finished Loading Sounds');
                        window["myApp"].finishedLoading();
                    }
                });
        });

    }

    private static PlaySoundFromBuffer(id:number){
        try{
            const audioCtx = BOBAPI.audioContext;
            audioCtx.resume();
            let soundBuffer = BOBAPI.soundBuffers[0];
            for(let i=0;i<BOBAPI.soundBuffers.length;i++){
                if (BOBAPI.soundBuffers[i].id==id)
                    soundBuffer = BOBAPI.soundBuffers[i];
            }
            var source = audioCtx.createBufferSource();
            source.buffer = soundBuffer.buffer;
            source.connect(audioCtx.destination);
            source.start();
        }catch(error){
            //in case the sound buffers haven't finished loading
        }
    }
}

