parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ghiG":[function(require,module,exports) {
var define;
var e;function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}function h(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&o(e,t)}function o(e,t){return(o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(e){var t=T();return function(){var i,n=y(e);if(t){var s=y(this).constructor;i=Reflect.construct(n,arguments,s)}else i=n.apply(this,arguments);return r(this,i)}}function r(e,i){return!i||"object"!==t(i)&&"function"!=typeof i?l(e):i}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}e(["require","exports","./bob","./thing","./data"],function(e,t,n,o,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=function(e){h(l,o.Thing);var t=a(l);function l(e,n,s,h,o){var a;return i(this,l),(a=t.call(this,e,n,h,o)).type_id=r.CONSTANTS.GameType.ENEMY,a.enemyID=s,a.enemyID==r.CONSTANTS.EnemyType.GreyZombie&&(a.height=20,a.width=30,a.speed=2,a.animationSpeed=4,a.y=a.y+20,a.AI_mode=r.CONSTANTS.AiMode.DumbWalk),a.enemyID==r.CONSTANTS.EnemyType.RedZombie&&(a.height=20,a.width=30,a.speed=2,a.animationSpeed=2,a.y=a.y+20,a.AI_mode=r.CONSTANTS.AiMode.DumbWalk),a.enemyID==r.CONSTANTS.EnemyType.Sluggo&&(a.height=16,a.width=16,a.speed=.5,a.animationSpeed=3,a.x=a.x+7,a.y=a.y+19,a.AI_mode=r.CONSTANTS.AiMode.DumbWalk),a}return s(l,[{key:"draw",value:function(){this.processAnimation(),this.defaultDraw()}},{key:"update",value:function(){this.state!=r.CONSTANTS.ThingState.FALLING&&(this.vx=0,this.vy=0,this.doAI(),this.getComponents())}},{key:"move",value:function(){if(this.state!=r.CONSTANTS.ThingState.FALLING){this.x=this.x+this.vx,this.movingX=!0,this.checkCorners(r.CONSTANTS.GameType.TILE);for(var e=0;e<this.currentLevel.objectSize;e++)this.checkCollision(this.currentLevel.objectArray[e])>0&&(this.currentLevel.objectArray[e].handleCollision(this),this.handleCollision(this.currentLevel.objectArray[e]));for(var t=0;t<this.currentLevel.enemySize;t++)this.checkCollision(this.currentLevel.enemyArray[t])>0&&(this.currentLevel.enemyArray[t].handleCollision(this),this.handleCollision(this.currentLevel.enemyArray[t]));this.movingX=!1,this.y=this.y+this.vy,this.movingY=!0,this.checkCorners(r.CONSTANTS.GameType.TILE);for(var i=0;i<this.currentLevel.objectSize;i++)this.checkCollision(this.currentLevel.objectArray[i])>0&&(this.currentLevel.objectArray[i].handleCollision(this),this.handleCollision(this.currentLevel.objectArray[i]));for(var n=0;n<this.currentLevel.enemySize;n++)this.checkCollision(this.currentLevel.enemyArray[n])>0&&this.handleCollision(this.currentLevel.enemyArray[n]);this.movingY=!1}}},{key:"processAnimation",value:function(){this.enemyID!=r.CONSTANTS.EnemyType.GreyZombie&&this.enemyID!=r.CONSTANTS.EnemyType.RedZombie||(this.state==r.CONSTANTS.ThingState.FALLING&&(this.animationCounter<15&&(this.currentFrame=12),this.animationCounter>=15&&this.animationCounter<30&&(this.currentFrame=13),this.animationCounter>=30&&this.animationCounter<45&&(this.currentFrame=14),this.animationCounter>=45&&(this.alive=!1)),this.state==r.CONSTANTS.ThingState.NORMAL&&(0==this.velocity&&(this.animationFlipper=0),this.angle>=0&&this.angle<90&&(this.currentFrame=9+this.animationFlipper),this.angle>=90&&this.angle<180&&(this.currentFrame=3+this.animationFlipper),this.angle>=180&&this.angle<270&&(this.currentFrame=0+this.animationFlipper),this.angle>=270&&this.angle<360&&(this.currentFrame=6+this.animationFlipper),this.animationCounter>=this.animationSpeed&&(this.animationFlipper++,this.animationCounter=0,this.animationFlipper>2&&(this.animationFlipper=0))),this.animationCounter++,this.bob.x=this.x,this.bob.y=this.y-20),this.enemyID==r.CONSTANTS.EnemyType.Sluggo&&(this.state==r.CONSTANTS.ThingState.NORMAL&&(0==this.velocity&&(this.animationFlipper=0),this.angle>=0&&this.angle<90&&(this.currentFrame=9+this.animationFlipper),this.angle>=90&&this.angle<180&&(this.currentFrame=3+this.animationFlipper),this.angle>=180&&this.angle<270&&(this.currentFrame=0+this.animationFlipper),this.angle>=270&&this.angle<360&&(this.currentFrame=6+this.animationFlipper),this.animationCounter>=this.animationSpeed&&(this.animationFlipper++,this.animationCounter=0,this.animationFlipper>2&&(this.animationFlipper=0))),this.state==r.CONSTANTS.ThingState.FALLING&&(this.alive=!1),this.animationCounter++,this.bob.x=this.x-7,this.bob.y=this.y-19),this.bob.curr_frame=this.currentFrame}},{key:"checkCorners",value:function(e){this.x<=0||this.y<=0||this.x+this.width-1>=40*this.currentLevel.width||this.y+this.height-1>=40*this.currentLevel.height||e==r.CONSTANTS.GameType.TILE&&(this.checkCollision(this.currentLevel.getTileObject(this.x,this.y))>0&&(this.handleCollision(this.currentLevel.getTileObject(this.x,this.y)),this.currentLevel.getTileObject(this.x,this.y).handleCollision(this)),this.checkCollision(this.currentLevel.getTileObject(this.x+this.width-1,this.y))>0&&(this.handleCollision(this.currentLevel.getTileObject(this.x+this.width-1,this.y)),this.currentLevel.getTileObject(this.x+this.width-1,this.y).handleCollision(this)),this.checkCollision(this.currentLevel.getTileObject(this.x+this.width-1,this.y+this.height-1))>0&&(this.handleCollision(this.currentLevel.getTileObject(this.x+this.width-1,this.y+this.height-1)),this.currentLevel.getTileObject(this.x+this.width-1,this.y+this.height-1).handleCollision(this)),this.checkCollision(this.currentLevel.getTileObject(this.x,this.y+this.height-1))>0&&(this.handleCollision(this.currentLevel.getTileObject(this.x,this.y+this.height-1)),this.currentLevel.getTileObject(this.x,this.y+this.height-1).handleCollision(this)))}},{key:"handleCollision",value:function(e){if(this!=e){if(this.enemyID==r.CONSTANTS.EnemyType.GreyZombie)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this),this.AI_mode=r.CONSTANTS.AiMode.DumbWalk);break;case r.CONSTANTS.AiMode.DumbWalk:if(e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this)),e.type_id==r.CONSTANTS.GameType.TILE)if(e.tileType==r.CONSTANTS.TileType.Wall){this.angle=90;var t=r.GetRandom(4);0==t&&(this.angle=0),1==t&&(this.angle=90),2==t&&(this.angle=180),3==t&&(this.angle=270)}if(e.type_id==r.CONSTANTS.GameType.OBJECT){var i=e;if(i.objectType==r.CONSTANTS.ObjectType.REDDOOR||i.objectType==r.CONSTANTS.ObjectType.GREENDOOR||i.objectType==r.CONSTANTS.ObjectType.BLUEDOOR){this.angle=90;var n=r.GetRandom(4);0==n&&(this.angle=0),1==n&&(this.angle=90),2==n&&(this.angle=180),3==n&&(this.angle=270),this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e)}}e.type_id==r.CONSTANTS.GameType.ENEMY&&(this.angle+=180,this.angle>=360&&(this.angle-=360));break;case r.CONSTANTS.AiMode.SeekPlayer:if(e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this)),e.type_id==r.CONSTANTS.GameType.OBJECT){var s=e;s.objectType!=r.CONSTANTS.ObjectType.REDDOOR&&s.objectType!=r.CONSTANTS.ObjectType.GREENDOOR&&s.objectType!=r.CONSTANTS.ObjectType.BLUEDOOR||(this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e))}}if(this.enemyID==r.CONSTANTS.EnemyType.RedZombie)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this),this.AI_mode=r.CONSTANTS.AiMode.DumbWalk);break;case r.CONSTANTS.AiMode.DumbWalk:if(e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this)),e.type_id==r.CONSTANTS.GameType.TILE){var h=e;if(h.tileType==r.CONSTANTS.TileType.Wall||h.tileType==r.CONSTANTS.TileType.Hole){this.angle=90;var o=r.GetRandom(4);0==o&&(this.angle=0),1==o&&(this.angle=90),2==o&&(this.angle=180),3==o&&(this.angle=270),this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e)}}if(e.type_id==r.CONSTANTS.GameType.OBJECT){var a=e;if(a.objectType==r.CONSTANTS.ObjectType.REDDOOR||a.objectType==r.CONSTANTS.ObjectType.GREENDOOR||a.objectType==r.CONSTANTS.ObjectType.BLUEDOOR){this.angle=90;var l=r.GetRandom(4);0==l&&(this.angle=0),1==l&&(this.angle=90),2==l&&(this.angle=180),3==l&&(this.angle=270),this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e)}}e.type_id==r.CONSTANTS.GameType.ENEMY&&(this.angle+=180,this.angle>=360&&(this.angle-=360));break;case r.CONSTANTS.AiMode.SeekPlayer:if(e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this)),e.type_id==r.CONSTANTS.GameType.TILE)e.tileType==r.CONSTANTS.TileType.Hole&&(this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e));if(e.type_id==r.CONSTANTS.GameType.OBJECT){var T=e;T.objectType!=r.CONSTANTS.ObjectType.REDDOOR&&T.objectType!=r.CONSTANTS.ObjectType.GREENDOOR&&T.objectType!=r.CONSTANTS.ObjectType.BLUEDOOR||(this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e))}}if(this.enemyID==r.CONSTANTS.EnemyType.Sluggo)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(25),this.currentLevel.player.bounce(this),this.AI_mode=r.CONSTANTS.AiMode.DumbWalk);break;case r.CONSTANTS.AiMode.DumbWalk:if(e.type_id==r.CONSTANTS.GameType.PLAYER&&(this.currentLevel.player.hurt(10),this.currentLevel.player.bounce(this)),e.type_id==r.CONSTANTS.GameType.TILE){var y=e;if(y.tileType==r.CONSTANTS.TileType.Wall||y.tileType==r.CONSTANTS.TileType.Hole){this.angle=90;var c=r.GetRandom(4);0==c&&(this.angle=0),1==c&&(this.angle=90),2==c&&(this.angle=180),3==c&&(this.angle=270),this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e)}}if(e.type_id==r.CONSTANTS.GameType.OBJECT){var S=e;if(S.objectType==r.CONSTANTS.ObjectType.REDDOOR||S.objectType==r.CONSTANTS.ObjectType.GREENDOOR||S.objectType==r.CONSTANTS.ObjectType.BLUEDOOR){this.angle=90;var p=r.GetRandom(4);0==p&&(this.angle=0),1==p&&(this.angle=90),2==p&&(this.angle=180),3==p&&(this.angle=270),this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e)}}e.type_id==r.CONSTANTS.GameType.ENEMY&&(this.angle+=180,this.angle>=360&&(this.angle-=360))}this.defaultHandleCollision(e)}}},{key:"defaultHandleCollision",value:function(e){e.type_id==r.CONSTANTS.GameType.ENEMY&&(this.movingX?this.moveToEdgeX(this,e):this.moveToEdgeY(this,e))}},{key:"doAI",value:function(){if(this.enemyID==r.CONSTANTS.EnemyType.GreyZombie)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:this.velocity=0,this.animationSpeed=4;break;case r.CONSTANTS.AiMode.DumbWalk:this.velocity=this.speed,this.animationSpeed=4,this.getDistance(this.currentLevel.player)<180&&(this.AI_mode=r.CONSTANTS.AiMode.SeekPlayer,n.BOBAPI.DSound_Play(5));break;case r.CONSTANTS.AiMode.SeekPlayer:this.angle=this.getAngle(this.currentLevel.player.x,this.currentLevel.player.y),this.velocity=this.speed+1,this.animationSpeed=2,this.getDistance(this.currentLevel.player)>300&&(this.AI_mode=r.CONSTANTS.AiMode.DumbWalk,n.BOBAPI.DSound_Play(10))}if(this.enemyID==r.CONSTANTS.EnemyType.RedZombie)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:this.velocity=0,this.animationSpeed=4;break;case r.CONSTANTS.AiMode.DumbWalk:this.velocity=this.speed,this.animationSpeed=4,this.getDistance(this.currentLevel.player)<180&&(this.AI_mode=r.CONSTANTS.AiMode.SeekPlayer,n.BOBAPI.DSound_Play(5));break;case r.CONSTANTS.AiMode.SeekPlayer:this.angle=this.getAngle(this.currentLevel.player.x,this.currentLevel.player.y),this.velocity=this.speed+2,this.animationSpeed=1,this.getDistance(this.currentLevel.player)>300&&(this.AI_mode=r.CONSTANTS.AiMode.DumbWalk,n.BOBAPI.DSound_Play(10))}if(this.enemyID==r.CONSTANTS.EnemyType.Sluggo)switch(this.AI_mode){case r.CONSTANTS.AiMode.Sleep:this.velocity=0,this.animationSpeed=3;break;case r.CONSTANTS.AiMode.DumbWalk:this.velocity=this.speed,this.animationSpeed=3}}},{key:"hurt",value:function(e){this.health-=e,this.health<=0&&(this.alive=!1)}},{key:"getDistance",value:function(e){return Math.sqrt(Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2))}}]),l}();t.Enemy=l});
},{}]},{},["ghiG"], null)
//# sourceMappingURL=game/enemy.js.map