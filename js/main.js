import {InputHandler} from './input.js'
import {Player} from './player.js'
import {Rect} from './rect.js'
import {Tools} from './tools.js'

class RoomOne {        // Use inheritance perhaps? a @TODO?
    constructor(game) {
        this.game = game;
        this.assets = {
            'room-one-closed': document.querySelector('.room-one-closed'),
            'room-one-open': document.querySelector('.room-one-open'),    // Dit zijn de assets van kamer 1
        };
        this.walls = [
            new Rect(0, 0, 75, 600),
            new Rect(0, 0, 600, 75),
            new Rect(0, 525, 600, 75),
            new Rect(525, 0, 75, 600),
            new Rect(75, 220, 95, 170),
            new Rect(180, 75, 50, 105),  // En hier de muren 
            new Rect(300, 75, 50, 105)
        ];

        this.player = new Player(this.game, this);
        this.doorCollider = new Rect(445, 75, 70, 25); // de doorcollider is niks anders dan een collider om te checken of je bij de deur staat
        this.accessCardPickup = new Rect(360, 200, 30, 30); // Same shit met de deur maar met de accesscard

        this.playerHasAccessCard = false; // Spreekt voor zich
        this.doorOpen = false; // dit ook wel
    }

    checkTriggerCollisions() { 
        // Kan wel een meer passende naam voor vnden
        if (!this.playerHasAccessCard) { // als de player geen accesscard heeft...
            if (Tools.AABB(this.player, this.accessCardPickup)) { // ...checken we of hij dichtbij genoeg is om die op te pakken 
                if (confirm('Ew, a dead body. I wonder how long this has been rotting here on the ground... Should I search it?')) {
                    confirm('You\'ve found an access card! Take it with you, maybe it will help you getting out of this room!')
                    this.playerHasAccessCard = true;
                    this.game.input.reset() // <<< Tijdelijke fix voor een bug met de input systeem en browser popup
                } else {
                    this.player.x += 50; // Tijdelijk fix voor een bug waar de player in de collider blijft staan en deze stuk code constant laat runnen
                    // @TODO: fix weird bug where confirms freeze the inputManager
                    // quickfix: 
                    this.game.input.reset()
                }
            }
        } else if (!this.doorOpen) { // als de deur niet open is, gaat die wel open zijn
            if (Tools.AABB(this.player, this.doorCollider)) {
                this.doorOpen = true;
                this.player.y += 75; // tijdelijk bugfix
            }
        } else {
            if (Tools.AABB(this.player, this.doorCollider)) {
                alert('So, progress huh. Where even am I? I better continue and get out of here...'); // progress naar kamer 2
            }
        } 
    }

    update() {
        this.player.update();
        this.checkTriggerCollisions();
    }

    draw() {
        this.game.ctx.clearRect(0, 0, this.width, this.height); // clear het scherm met de contextmanager
        if (this.doorOpen){
            this.game.ctx.drawImage(this.assets['room-one-open'], 0, 0, 600, 600) // spreekt voor zich
        } else {
            this.game.ctx.drawImage(this.assets['room-one-closed'], 0, 0, 600, 600)
        }
        
        this.player.draw();
    }
}







window.addEventListener('load', () => {
    const canvas = document.querySelector('.mainCanvas'); // de canvas
    const ctx = canvas.getContext('2d'); // hier maken we een 2d context
    canvas.width = 600; // gewoon de grootte enzo
    canvas.height = 600;
    

    class Game {
        constructor(width, height) {
            this.ctx = ctx; // contextmanager
            this.width = width; 
            this.height = height;
            this.desiredFPS = 30; // me skere fps handling systeem
            this.input = new InputHandler();    
            this.loop = this.mainloop.bind(this); // Eerlijk, geen idee waarom het werkt, maar het werkt wel dus ja  
            this.roomOne = new RoomOne(this)
        

            // die goofy ah fps controle systeem
            this.now = Date.now();
            this.then = Date.now();
            this.updateInterval = 1000 / this.desiredFPS;
            this.elapsed = 0;
        }

        update() {
            this.roomOne.update();
            this.roomOne.draw();
        }

        mainloop() {

            window.requestAnimationFrame(this.loop); // forceer een update
            
            this.now = Date.now();
            this.elapsed = this.now - this.then; // die skere slome fps ding weer

            if (this.elapsed > this.updateInterval) {
                this.then = this.now - (this.elapsed % this.updateInterval);
                this.update(); // update heel de ding na een bepalde tijd. De tijd word door het desiredFPS bepaald
            }
        }
    }

    const game = new Game(canvas.width, canvas.height); // spreekt voor zich
    game.mainloop();
});