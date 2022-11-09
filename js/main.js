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
    ctx.imageSmoothingEnabled = false;
    

    class Game {
        constructor(width, height) {
            this.rooms = [new RoomOne(this), new RoomTwo(this)];
            this.currentRoom = 1;
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
            this.ctx.fillStyle = 'black'
            this.rooms[this.currentRoom].draw();
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            // this.debugWalls();
        }


        debugWalls() { // TIJDELIJK
            this.rooms[this.currentRoom].walls.forEach((w, i) => {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.fillRect(w.x, w.y, w.w, w.h);
                this.ctx.fillStyle = 'black';
                this.ctx.strokeText(i, w.x+5, w.y+10);
            });

            const x = this.rooms[this.currentRoom].terminalCollider;
            this.ctx.fillRect(x.x, x.y, x.w, x.h)
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
            this.input.reset(); // Tijdelijke bug oplossing
        }
    }

    const game = new Game(canvas.width, canvas.height); // spreekt voor zich
    game.mainloop();
});