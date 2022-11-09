import {Player} from './player.js'
import {Rect} from './rect.js'
import {Tools} from './tools.js'


export class RoomOne {        // Use inheritance perhaps? a @TODO?
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

        this.player = new Player(this.game, this, 260, 150);
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
                this.game.nextRoom();
                this.game.player.x = 150;
                this.game.player.y = 450;
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


export class RoomTwo {
    constructor(game) {
        this.game = game;
        this.assets = {
            'room-two': document.querySelector('.room-two'),
            'terminal': document.querySelector('.terminal')
        };
        this.walls = [
            new Rect(85, 0, 70, 600),
            new Rect(155, 0, 290, 75),
            new Rect(155, 530, 290, 75),
            new Rect(445, 0, 75, 600),
        ];

        this.liftDoorCollider = new Rect(275, 75, 50, 30);
        this.terminalCollider = new Rect(355, 75, 30, 10)
        
        this.usingTerminal = true;
        this.terminalFixed = false;

        this.terminalWireColliders = [
            new Rect(90, 90, 50, 50),
            new Rect(275, 90, 50, 50),
            new Rect(440, 90, 50, 50),
        ];

        this.terminalConnectorColliders = [
            new Rect(60, 450, 80, 50),
            new Rect(245, 450, 100, 50),
            new Rect(445, 450, 80, 50)
        ]

        this.player = new Player(this.game, this, 300, 500);

    }

    checkTriggerCollisions() { 
        if (Tools.AABB(this.player, this.terminalCollider)) {
            this.usingTerminal = true;
        }
    }

    update() {
        this.player.update();
        this.checkTriggerCollisions();
        if (this.usingTerminal && this.game.input.getPressed()['escape']) {
            this.usingTerminal = false;
            this.player.y = 500;
        }
    }

    draw() {
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        if (this.usingTerminal) {
            this.game.ctx.drawImage(this.assets['terminal'], 0, 0, 600, 600);
        } else if (!this.terminalFixed) {

            this.game.ctx.drawImage(this.assets['room-two'], 0, 0, 600, 600);
            this.player.draw()
        }

    }
}