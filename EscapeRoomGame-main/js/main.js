import {InputHandler} from './input.js'
import {RoomOne, RoomTwo} from './rooms.js'
// import {Player} from './player.js'
// import {Rect} from './rect.js'
// import {Tools} from './tools.js'


window.addEventListener('load', () => {
    const canvas = document.querySelector('.mainCanvas'); // de canvas
    const ctx = canvas.getContext('2d'); // hier maken we een 2d context
    canvas.width = 600; // gewoon de grootte enzo
    canvas.height = 600;
    

    class Game {
        constructor(width, height) {
            this.rooms = [new RoomOne(this), new RoomTwo(this)];
            this.currentRoom = 0;
            this.ctx = ctx; // contextmanager
            this.width = width; 
            this.height = height;
            this.desiredFPS = 30; // me skere fps handling systeem
            this.input = new InputHandler();    
            this.loop = this.mainloop.bind(this); // Eerlijk, geen idee waarom het werkt, maar het werkt wel dus ja  
        

            // die goofy ah fps controle systeem
            this.now = Date.now();
            this.then = Date.now();
            this.updateInterval = 1000 / this.desiredFPS;
            this.elapsed = 0;
        }

        update() {
            this.rooms[this.currentRoom].update();
            this.rooms[this.currentRoom].draw();
            
        }

        mainloop() {

            window.requestAnimationFrame(this.loop); // forceer een update
            
            this.now = Date.now();
            this.elapsed = this.now - this.then; // die skere slome fps ding weer
            
            if (this.elapsed > this.updateInterval) {
                this.then = this.now - (this.elapsed % this.updateInterval);
                this.update(); // update heel de ding na een bepalde tijd. De tijd word door het desiredFPS bepaald\
            }
        }

        nextRoom() {
            this.currentRoom++;
        }
    }

    const game = new Game(canvas.width, canvas.height); // spreekt voor zich
    game.mainloop();
});