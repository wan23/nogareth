import { BOB, BOBAPI } from "./bob";
import { Level } from "./level";
import { CONSTANTS } from "./data";

export class Thing {

	type_id: number;	// Identifies whether it is an enemy, obj, or player
	x: number; // position of this thing in area coordinates
	y: number;
	bob: BOB; // pointer to a bob that contains image data
	currentLevel: Level; //pointer to the main module's level object
	health = 100; //your health as a percentage
	alive = true; // determines whether this thing is processed, drawn
	angle = 180; // direction of motion - should match with xv, yv
				 // so that xv=speed*cos(angle), yv=speed*sin(angle)
	speed = 0; // how fast this thing CAN move
	vx = 0; // current speed of this thing in x and y
	vy = 0;
	alpha = 100; // visibility level - 0 - invisible, 100 - opaque
	currentRoom = 0; // the room the THING is in
	animationCounter = 0; //used for animation
	animationFlipper = 0; //used for animation
	animationSpeed = 0;   //used for animation
	startTime = 0; //number of frames before THING starts
	velocity = 0; //how fast thing thing IS moving
	currentFrame = 0; //the frame with which to draw_BOB

	movingX = false;
	movingY = false;
	height = 40;
	width = 40;
	state: number = CONSTANTS.ThingState.NORMAL; // valid states depend on what exactly the thing is
										 // but all things have states
	AI_mode:number;

	/*
	Constructor. Takes initial x and y position in area coordinates.
	Protected because you should never create an
	instance of this class -- you should
	make one of a child class instead.
	*/
	constructor(xt: number, yt: number, bobt: BOB, l: Level) {
		this.x = xt;
		this.y = yt;
		this.bob = bobt;
		this.currentLevel = l;
	}

	draw() {

	}

	//sets up vx and vy based on speed and direction
	getComponents() {
		this.vx = (this.velocity * Math.sin((this.angle * (3.14159) / 180)));
		this.vy = -(this.velocity * Math.cos((this.angle * (3.14159) / 180)));
	}

	/*	
		returns number of corners at which collision occured
	*/
	checkCollision(thing: Thing): number {
		if (this.state == CONSTANTS.ThingState.FALLING || thing.state == CONSTANTS.ThingState.FALLING)
			return 0;

		let count = 0;
		let xtemp, ytemp;


		xtemp = this.x + this.width - 1;
		ytemp = this.y;
		if (thing.x <= xtemp && xtemp <= (thing.x + thing.width - 1) && thing.y <= ytemp && ytemp <= (thing.y + thing.height - 1))
			count++;

		xtemp = this.x;
		ytemp = this.y;
		if (thing.x <= xtemp && xtemp <= (thing.x + thing.width - 1) && thing.y <= ytemp && ytemp <= (thing.y + thing.height - 1))
			count++;

		xtemp = this.x + this.width - 1;
		ytemp = this.y + this.height - 1;
		if (thing.x <= xtemp && xtemp <= (thing.x + thing.width - 1) && thing.y <= ytemp && ytemp <= (thing.y + thing.height - 1))
			count++;

		xtemp = this.x;
		ytemp = this.y + this.height - 1;
		if (thing.x <= xtemp && xtemp <= (thing.x + thing.width - 1) && thing.y <= ytemp && ytemp <= (thing.y + thing.height - 1))
			count++;

		if (count > 0)
			return count;

		xtemp = thing.x + thing.width - 1;
		ytemp = thing.y;
		if (this.x <= xtemp && xtemp <= (this.x + this.width - 1) && this.y <= ytemp && ytemp <= (this.y + this.height - 1))
			count++;

		xtemp = thing.x;
		ytemp = thing.y;
		if (this.x <= xtemp && xtemp <= (this.x + this.width - 1) && this.y <= ytemp && ytemp <= (this.y + this.height - 1))
			count++;

		xtemp = thing.x + thing.width - 1;
		ytemp = thing.y + thing.height - 1;
		if (this.x <= xtemp && xtemp <= (this.x + this.width - 1) && this.y <= ytemp && ytemp <= (this.y + this.height - 1))
			count++;

		xtemp = thing.x;
		ytemp = thing.y + thing.height - 1;
		if (this.x <= xtemp && xtemp <= (this.x + this.width - 1) && this.y <= ytemp && ytemp <= (this.y + this.height - 1))
			count++;

		return count;
	}

	defaultDraw() {
		this.bob.x = this.bob.x + (320 - this.currentLevel.player.x);
		this.bob.y = this.bob.y + (240 - this.currentLevel.player.y);
		//console.log(String(this.bob.x) + " " + String(this.bob.y))
		BOBAPI.Draw_BOB16(this.bob);
	}

	/*
	this will determine what frame of animation to set
	*/
	processAnimation() {

	}

	/* Should be called when a collision occurs between 
		this and something else.
	*/
	handleCollision(thing: Thing) {

	}

	//moves thing1 to the edge of thing2 horizontally
	moveToEdgeX(thing1: Thing, thing2: Thing) {
		if (thing1.x < thing2.x) {
			thing1.x = thing2.x - thing1.width;
		}
		else {
			thing1.x = thing2.x + thing2.width;
		}
	}

	//moves thing1 to the edge of thing2 vertically
	moveToEdgeY(thing1: Thing, thing2: Thing) {
		if (thing1.y < thing2.y) {
			thing1.y = thing2.y - thing1.height;
		}
		else {
			thing1.y = thing2.y + thing2.height;
		}
	}

	//TODO - check for rounding errors
	//rounds the number to the nearest int
	round(number: number) {
		return Math.round(number);

		//OLD CODE 
		// if (number>0 && number - ((int)number)>.5)
		// {
		// 	return (float)((int)number+1);
		// }
		// if (number>0 && number - (float)((int)number)<=.5)
		// {
		// 	return (float)((int)number);
		// }
		// if (number<0 && number - (float)((int)number)<=.5)
		// {
		// 	return (float)((int)number);
		// }
		// if (number<0 && number - (float)((int)number)>.5)
		// {
		// 	return (float)((int)number+1);
		// }
		// return number;
	}

	hurt(h: number) {
		this.health -= h;
		if (this.health <= 0)
			this.alive = false;
	}

	getAngle(x2: number, y2: number): number {

		let x1 = this.x;
		let y1 = this.y;
		/*
		int opposite;
		int hypotenuse;
		opposite = y1-y2;
		hypotenuse = x1 - x2;
		int angle = (int)((double)180/(3.14159))*asin((double)opposite/(double)hypotenuse);
		angle+=90;
		//if (angle<0)
		//	angle+=180;
		//if (x2<x1)
		//	angle+=180;
		if (opposite>0 && hypotenuse>0)
			angle+=180;
		if (angle>=360)
			angle-=360;
		*/
		if (x1 < x2 && y1 > y2)
			this.angle = 45;
		if (x1 < x2 && y1 < y2)
			this.angle = 135;
		if (x1 > x2 && y1 < y2)
			this.angle = 225;
		if (x1 > x2 && y1 > y2)
			this.angle = 315;
		if (Math.abs(x1 - x2) <= 5 && y1 < y2)
			this.angle = 180;
		if (Math.abs(x1 - x2) <= 5 && y1 > y2)
			this.angle = 0;
		if (Math.abs(y1 - y2) <= 5 && x1 < x2)
			this.angle = 90;
		if (Math.abs(y1 - y2) <= 5 && x1 > x2)
			this.angle = 270;

		this.alpha = this.angle;
		return this.angle;
	}

	//ADDITIONAL FUNCTION HEADERS FOUND IN THING.H - 

	/* This method should be called every frame to allow
		this thing to update itself. For enemies, AI occurs
		here. For the player, input is processed in this 
		method. Objects probably have nothing to do, but
		just in case, they should be updated anyway.
	*/
	update() {

	}

	/* Starts the process of moving this object. This method
		moves the thing based on its vx and vy. Also calls
		the collision detector and calls handleCollision on
		this or any other things as necessary.
		call getRoom();

	*/
	defaultMove() {

	}

	/*
		Saves this object to a file that
		is already set to the correct position
		This absolutely needs to be overriden
	*/
	save(file) {

	}

	/*
		Loads this object from an open file
		that is already set to the correct position
		This absolutely needs to be overriden
	*/
	load(file) {

	}

	//drops the object down a hole
	drop() {

	}

	//sets currentRoom variable to the current room
	getRoom() {

	}
}

