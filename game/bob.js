//will be a replacement for the old BOB class
//as you come across properties during porting
define(["require", "exports", "./data"], function (require, exports, data_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BOBAPI = exports.BOB = void 0;
    //just add them on to the class as needed
    class BOB {
        constructor(width, height) {
            this.x = 0;
            this.y = 0;
            this.curr_frame = 0;
            // frame number -> FrameData
            this.frames = {};
            this.width = width;
            this.height = height;
        }
        getCurrentFrameData() {
            return this.getFrameData(this.curr_frame);
        }
        getFrameData(frameNumber) {
            return this.frames[frameNumber];
        }
    }
    exports.BOB = BOB;
    class FrameData {
        constructor(image, left, top, width, height) {
            this.image = image;
            this.top = top;
            this.left = left;
            this.width = width;
            this.height = height;
        }
    }
    //use this to placeholder the BOB API calls
    let BOBAPI = /** @class */ (() => {
        class BOBAPI {
            static Draw_BOB16(bob) {
                let frameData = bob.getCurrentFrameData();
                if (bob.x > data_1.CONSTANTS.ScreenWidth ||
                    bob.x + bob.width < 0 ||
                    bob.y > data_1.CONSTANTS.ScreenHeight ||
                    bob.y + bob.height < 0) {
                    //console.log(`${frameData.left} ${frameData.top} `)
                    return;
                }
                data_1.CANVAS.drawImage(frameData.image, frameData.left, frameData.top, frameData.width, frameData.height, bob.x, bob.y, bob.width, // TODO: Multiply these by global scale factor
                bob.height);
            }
            // Loads a frame from the sprite sheet. Width and height must be set before using this.
            // if mode = BITMAP_EXTRACT_MODE_ABS then set cell_mode = false when calling this
            static Load_Frame_BOB16(bob, image, frameNumber, cx, cy, cell_mode = true) {
                var x, y;
                if (cell_mode) {
                    x = cx * (bob.width + 1) + 1;
                    y = cy * (bob.height + 1) + 1;
                }
                else {
                    x = cx;
                    y = cy;
                }
                bob.frames[frameNumber] = new FrameData(image, x, y, bob.width, bob.height);
            }
            static Create_BOB(x, y, width, height, numFrames) {
                var bob = new BOB(width, height);
                bob.x = x;
                bob.y = y;
                bob.numFrames = numFrames;
                return bob;
            }
            // The color can be any CSS color string like "#FFFFFF" or "white"
            static Draw_Line16(x1, y1, x2, y2, color) {
                let ctx = data_1.CANVAS;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            // The color can be any CSS color string like "#FFFFFF" or "white"
            // This is very inefficient - should set color and then draw all the pixels
            static Draw_Pixel16(x, y, color) {
                let ctx = data_1.CANVAS;
                ctx.fillStyle = color;
                ctx.fillRect(x, y, 1, 1);
            }
            // This should probably be preloading the audio
            static DSound_Play(soundID) {
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
            static DrawText(text, x, y, maxWidth, lineHeight, color) {
                var words = text.split(' ');
                var line = '';
                let context = data_1.CANVAS;
                context.fillStyle = color;
                context.font = "16px Verdana,Arial";
                for (var n = 0; n < words.length; n++) {
                    var word = words[n];
                    if (word == "<break>") {
                        context.fillText(line, x, y);
                        y += lineHeight;
                        line = "";
                        continue;
                    }
                    else if (word.startsWith("**")) {
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
                            offset = maxWidth - testWidth;
                        }
                        context.fillText(line, x + offset, y);
                        line = "";
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
            static DMusic_Play(musicID) {
                //call this twice so that current music stops playing immediately
                if (window['player']) {
                    window['player'].stop();
                }
                let buffer = new Tone.Buffer(data_1.MUSIC_FILES[musicID], buffer => {
                    Tone.context.resume();
                    //call this again just in case before starting new track
                    if (window['player']) {
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
            static DMusic_Stop() {
                // BOBAPI.musicPlayer.pause();
                if (window['player']) {
                    window['player'].stop();
                }
            }
            static RGB(r, g, b) {
                let toHex = function (n) {
                    if (n >= 16) {
                        return n.toString(16);
                    }
                    else {
                        return "0" + n.toString();
                    }
                };
                return "#" + toHex(r) + toHex(g) + toHex(b);
            }
            static LoadAllSounds() {
                let audioCtx;
                try {
                    audioCtx = new AudioContext();
                }
                catch (error) {
                    try {
                        //try for mobile
                        audioCtx = new window['webkitAudioContext']();
                        console.log('found mobile audio');
                    }
                    catch (error2) {
                        console.log('could not initialize audio');
                    }
                }
                BOBAPI.audioContext = audioCtx;
                audioCtx.resume();
                data_1.SOUND_FILES.forEach(sound => {
                    // Fetch the sound file from the server
                    fetch(sound)
                        // Return the data as an ArrayBuffer
                        .then(response => response.arrayBuffer())
                        // Decode the audio data
                        .then(buffer => audioCtx.decodeAudioData(buffer))
                        .then(decodedData => {
                        let soundid = 0;
                        for (let i = 0; i < data_1.SOUND_FILES.length; i++) {
                            if (data_1.SOUND_FILES[i] == sound)
                                soundid = i;
                        }
                        //store it in an audio buffer array for later when needed
                        var soundBuffer = { id: soundid, buffer: decodedData };
                        BOBAPI.soundBuffers.push(soundBuffer);
                        if (BOBAPI.soundBuffers.length == data_1.SOUND_FILES.length) {
                            console.log('Finished Loading Sounds');
                            window["myApp"].finishedLoading();
                        }
                    });
                });
            }
            static PlaySoundFromBuffer(id) {
                try {
                    const audioCtx = BOBAPI.audioContext;
                    audioCtx.resume();
                    let soundBuffer = BOBAPI.soundBuffers[0];
                    for (let i = 0; i < BOBAPI.soundBuffers.length; i++) {
                        if (BOBAPI.soundBuffers[i].id == id)
                            soundBuffer = BOBAPI.soundBuffers[i];
                    }
                    var source = audioCtx.createBufferSource();
                    source.buffer = soundBuffer.buffer;
                    source.connect(audioCtx.destination);
                    source.start();
                }
                catch (error) {
                    //in case the sound buffers haven't finished loading
                }
            }
        }
        BOBAPI.musicPlayer = document.createElement('audio');
        BOBAPI.soundBuffers = [];
        return BOBAPI;
    })();
    exports.BOBAPI = BOBAPI;
});
//# sourceMappingURL=bob.js.map