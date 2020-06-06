parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"xLgV":[function(require,module,exports) {
var define;
var t;function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,e,i){return e&&r(t.prototype,e),i&&r(t,i),t}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=u();return function(){var i,r=T(t);if(e){var n=T(this).constructor;i=Reflect.construct(r,arguments,n)}else i=r.apply(this,arguments);return c(this,i)}}function c(t,i){return!i||"object"!==e(i)&&"function"!=typeof i?o(t):i}function o(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function T(t){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}t(["require","exports","./bob","./thing","./data"],function(t,e,r,a,c){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(t){s(o,a.Thing);var e=l(o);function o(t,r,n,s,a){var l;return i(this,o),(l=e.call(this,t,r,s,a)).tileID=n,l.type_id=c.CONSTANTS.GameType.TILE,l.height=c.CONSTANTS.TileHeight,l.width=c.CONSTANTS.TileWidth,l.tileID<104&&(l.tileType=c.CONSTANTS.TileType.Wall),l.tileID>=104&&l.tileID<132&&(l.tileType=c.CONSTANTS.TileType.Floor),(l.tileID>=132&&l.tileID<136||138==l.tileID)&&(l.tileType=c.CONSTANTS.TileType.Hole),137==l.tileID&&(l.tileType=c.CONSTANTS.TileType.Spike,l.state=c.CONSTANTS.TileState.Up),136==l.tileID&&(l.tileType=c.CONSTANTS.TileType.Spike),l.state=c.CONSTANTS.TileState.Down,l.scriptLoaded=!1,l.scriptNeedsReset=!1,l.script=[],l}return n(o,[{key:"draw",value:function(){this.processAnimation(),this.defaultDraw()}},{key:"processAnimation",value:function(){this.currentFrame=this.tileID,this.bob.curr_frame=this.currentFrame,this.bob.x=this.x,this.bob.y=this.y}},{key:"handleCollision",value:function(t){t.type_id==c.CONSTANTS.GameType.PLAYER&&1==this.scriptLoaded&&0==this.scriptNeedsReset&&this.processScript(t),this.scriptNeedsReset||this.defaultHandleCollision(t)}},{key:"defaultHandleCollision",value:function(t){if(t.type_id==c.CONSTANTS.GameType.PLAYER||t.type_id==c.CONSTANTS.GameType.ENEMY)if(this.tileType==c.CONSTANTS.TileType.Wall)t.movingX?this.moveToEdgeX(t,this):this.moveToEdgeY(t,this);else if(this.tileType==c.CONSTANTS.TileType.Hole){if(this.currentLevel.getTileObject(t.x,t.y).tileType==c.CONSTANTS.TileType.Hole&&this.currentLevel.getTileObject(t.x+t.width-1,t.y).tileType==c.CONSTANTS.TileType.Hole&&this.currentLevel.getTileObject(t.x+t.width-1,t.y+t.height-1).tileType==c.CONSTANTS.TileType.Hole&&this.currentLevel.getTileObject(t.x,t.y+t.height-1).tileType==c.CONSTANTS.TileType.Hole)if(t.state=c.CONSTANTS.ThingState.FALLING,t.animationCounter=0,t.type_id==c.CONSTANTS.GameType.PLAYER&&r.BOBAPI.DSound_Play(4),t.type_id==c.CONSTANTS.GameType.ENEMY)t.enemyID==c.CONSTANTS.EnemyType.GreyZombie&&this.getDistance(t)<350&&r.BOBAPI.DSound_Play(9)}else this.tileType==c.CONSTANTS.TileType.Spike&&this.state==c.CONSTANTS.TileState.Up&&t.hurt(1)}},{key:"updateState",value:function(){this.tileType==c.CONSTANTS.TileType.Spike?this.stateChanged&&(this.state==c.CONSTANTS.TileState.On?(this.toggleTime=150,this.stateChangeTimer=this.toggleTime,this.state=c.CONSTANTS.TileState.Up,this.nextState=c.CONSTANTS.TileState.Down):this.state==c.CONSTANTS.TileState.Up?this.tileID=137:this.state==c.CONSTANTS.TileState.Down&&(this.tileID=136),this.stateChanged=!1):this.tileID>=96&&this.tileID<100?this.stateChanged&&this.state==c.CONSTANTS.TileState.Off&&(r.BOBAPI.DSound_Play(7),this.tileID+=4,this.stateChanged=!1,this.tileType=c.CONSTANTS.TileType.Wall):this.tileID>=100&&this.tileID<104&&this.stateChanged&&this.state==c.CONSTANTS.TileState.On&&(r.BOBAPI.DSound_Play(7),this.tileID-=4,this.stateChanged=!1,this.tileType=c.CONSTANTS.TileType.Wall)}},{key:"update",value:function(){if(this.stateChangeTimer>=0&&(this.stateChangeTimer--,-1==this.stateChangeTimer))if(this.toggleTime>0){this.stateChangeTimer=this.toggleTime;var t=this.nextState;this.nextState=this.state,this.state=t,this.stateChanged=!0}else this.state=this.nextState,this.stateChanged=!0;1==this.scriptNeedsReset&&0==this.checkCollision(this.currentLevel.player)&&(this.scriptNeedsReset=!1),this.updateState()}},{key:"processScript",value:function(t){this.scriptNeedsReset=!0;for(var e=0;e<this.numInstructions;e++){var i=this.script[e];switch(i.id){case c.CONSTANTS.ScriptInstrType.SetState:var n=i;this.currentLevel.tileObjects[n.x][n.y].state=n.newState,this.currentLevel.tileObjects[n.x][n.y].nextState=n.newState,this.currentLevel.tileObjects[n.x][n.y].stateChangeTimer=-1,this.currentLevel.tileObjects[n.x][n.y].toggleTime=-1,this.currentLevel.tileObjects[n.x][n.y].stateChanged=!0,this.currentLevel.tileObjects[n.x][n.y].updateState();break;case c.CONSTANTS.ScriptInstrType.SetStateTemp:var s=i;this.currentLevel.tileObjects[s.x][s.y].state=s.newState1,this.currentLevel.tileObjects[s.x][s.y].nextState=s.newState2,this.currentLevel.tileObjects[s.x][s.y].stateChangeTimer=s.time,this.currentLevel.tileObjects[s.x][s.y].toggleTime=-1,this.currentLevel.tileObjects[s.x][s.y].stateChanged=!0,this.currentLevel.tileObjects[s.x][s.y].updateState();break;case c.CONSTANTS.ScriptInstrType.ToggleState:var a=i;this.currentLevel.tileObjects[a.x][a.y].state=a.newState1,this.currentLevel.tileObjects[a.x][a.y].nextState=a.newState2,a.delay>0?this.currentLevel.tileObjects[a.x][a.y].stateChangeTimer=a.delay:this.currentLevel.tileObjects[a.x][a.y].stateChangeTimer=a.time,this.currentLevel.tileObjects[a.x][a.y].toggleTime=a.time,this.currentLevel.tileObjects[a.x][a.y].stateChanged=!0,this.currentLevel.tileObjects[a.x][a.y].updateState();break;case c.CONSTANTS.ScriptInstrType.LoadLevel:var l=i;c.GAME.load_level(l.filename);break;case c.CONSTANTS.ScriptInstrType.PlaySound:var o=i;r.BOBAPI.DSound_Play(o.sound_id);break;case c.CONSTANTS.ScriptInstrType.PlayMusic:var u=i;r.BOBAPI.DMusic_Play(u.music_id),this.currentLevel.songID=u.music_id;break;case c.CONSTANTS.ScriptInstrType.Teleport:var T=i;this.currentLevel.player.x=40*T.tile_x,this.currentLevel.player.y=40*T.tile_y;break;case c.CONSTANTS.ScriptInstrType.TextBox:var h=i;c.GAME.show_text_box(h.text);break;case c.CONSTANTS.ScriptInstrType.Lights:var p=i;c.GAME.set_lights(p.on_or_off);break;case c.CONSTANTS.ScriptInstrType.WinGame:c.GAME.game_win_game();break;case c.CONSTANTS.ScriptInstrType.RestoreHealth:this.currentLevel.player.health=100;break;case c.CONSTANTS.ScriptInstrType.Jump:(e+=i.howFar)<0&&(e=0);break;case c.CONSTANTS.ScriptInstrType.JumpIfEqual:var S=i;this.currentLevel.tileObjects[S.x][S.y].state==S.state&&(e+=S.howFar)<0&&(e=0);break;case c.CONSTANTS.ScriptInstrType.JumpIfNotEqual:var y=i;this.currentLevel.tileObjects[y.x][y.y].state!=y.state&&(e+=y.howFar)<0&&(e=0)}}}},{key:"getDistance",value:function(t){return Math.sqrt(Math.pow(this.currentLevel.player.x-t.x,2)+Math.pow(this.currentLevel.player.y-t.y,2))}}]),o}();e.Tile=o;var u=function t(){i(this,t)};e.instr=u;var T=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.set_state_instr=T;var h=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.set_state_temp_instr=h;var p=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.load_level_instr=p;var S=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.play_sound_instr=S;var y=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.play_music_instr=y;var f=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.teleport_instr=f;var N=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.text_box_instr=N;var v=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.toggle_state_instr=v;var O=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.win_game_instr=O;var C=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.restore_health_instr=C;var b=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.lights_instr=b;var d=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.jump_instr=d;var g=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.jump_if_equal_instr=g;var m=function(t){s(r,u);var e=l(r);function r(){return i(this,r),e.apply(this,arguments)}return r}();e.jump_if_not_equal_instr=m});
},{}]},{},["xLgV"], null)
//# sourceMappingURL=game/tile.js.map