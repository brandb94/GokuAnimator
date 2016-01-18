function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}


//POWER RANGER
function PowerRanger(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/GreenRanger.png"), 10, 105, 55, 89, 0.25, 10, true, false);

    this.animations = {};
    //Define animations
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

PowerRanger.prototype = new Entity();
PowerRanger.prototype.constructor = PowerRanger;



PowerRanger.prototype.draw = function(ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

//END POWER RANGER


//GOKU

function Goku(game) {
    this.animations = {};
    this.animations.nIdle = new Animation(ASSET_MANAGER.getAsset("./img/GokuTrans.png"), 1, 351, 41, 87, .5, 1, true, false);
    this.animations.nFlyRight = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 555, 190, 100, 51,.5, 1, true, false );
    this.animations.nFlyLeft = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 670, 189, 86, 51,.02, 1, true, false);
    this.animations.nFlyUp = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 5, 400, 47, 66,.02, 1, true, false);
    this.animations.nFlyDown = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 73, 400, 42, 61,.02, 1, true, false);


    //begin super saiyan
    this.animations.goFullSS = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 0, 0, 100, 108, .12, 11, false, false);
    this.animations.SSIdle = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 601, 1, 79, 108, .02, 1, true, false);
    this.animations.SSFlyLeft = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 425, 185, 117, 61,.02, 1, true, false);
    this.animations.SSFlyRight = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 301, 184, 109, 66, .02, 1, true, false);
    this.animations.SSFlyUp = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 134, 400, 70, 71, .02, 1, true, false);
    this.animations.SSFlyDown = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 210, 395, 60, 72, .02, 1, true, false);
    this.animations.SSKamehameha = new Animation(ASSET_MANAGER.getAsset("./img/customGoku.png"), 145, 495, 150, 80, .25, 11, false, false );

    //states
    this.idle = true;
    this.SSidle = false;
    this.flyingRight = false;
    this.flyingLeft = false;
    this.flyingUp = false;
    this.flyingDown = false;

    this.goingFullSS = false;
    this.performingKamehameha = false;


    this.isSS = false;
    this.SSidle = false;
    this.SSFlyingRight = false;
    this.SSFlyingLeft = false;

    this.radius = 100;
    this.ground = 300;
    Entity.call(this, game, 0, this.ground);




}

Goku.prototype = new Entity();
Goku.prototype.constructor = Goku;


Goku.prototype.update = function() {
    if (this.game.right) this.flyingRight = true;
    else this.flyingRight = false;

    if (this.game.left) this.flyingLeft = true;
    else this.flyingLeft = false;

    if (this.game.space) this.goingFullSS = true;

    if (this.game.up) this.flyingUp = true;
    else this.flyingUp = false;

    if (this.game.down) this.flyingDown = true;
    else this.flyingDown = false;

    if (this.game.eKey && this.isSS) this.performingKamehameha = true;
    else this.performingKamehameha = false;






    //Super saiyan direction checks
    if (this.isSS) {
        if ( this.flyingRight || this.flyingLeft || this.flyingDown || this.flyingUp || this.performingKamehameha ) this.SSidle = false;
        else this.SSidle = true;





    } else { //Not super saiyan
        if ( this.flyingRight || this.flyingLeft || this.flyingDown || this.flyingUp ) this.idle = false;
        else this.idle = true;

    }

    if (this.goingFullSS) {
        this.idle = false;
        if (this.animations.goFullSS.isDone()) {
            this.goingFullSS = false;

            this.SSidle = true;
            this.isSS = true;
        }
    }

    if (this.performingKamehameha) {
        if (this.animations.SSKamehameha.isDone()) {
            this.performingKamehameha = false;
            this.SSidle = true;
        }
    }



    Entity.prototype.update.call(this);

}

Goku.prototype.draw = function(ctx) {
    if (this.goingFullSS) {
        this.animations.goFullSS.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    if (this.isSS) {
        if (this.flyingRight && this.flyingUp) this.animations.SSFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y -= 5);
        else if (this.flyingRight && this.flyingDown) this.animations.SSFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y += 5);
        else if (this.flyingRight) this.animations.SSFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y);


        if (this.flyingLeft && this.flyingUp) this.animations.SSFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y -=5);
        else if (this.flyingLeft && this.flyingDown) this.animations.SSFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y +=5);
        else if (this.flyingLeft) this.animations.SSFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y);



        if (this.y < 410 && this.flyingDown && !this.flyingLeft && !this.flyingRight) this.animations.SSFlyDown.drawFrame(this.game.clockTick, ctx, this.x, this.y += 5);
        if (this.flyingUp && !this.flyingLeft && !this.flyingRight) this.animations.SSFlyUp.drawFrame(this.game.clockTick, ctx, this.x, this.y -= 5);

        if (this.performingKamehameha) this.animations.SSKamehameha.drawFrame(this.game.clockTick, ctx, this.x, this.y);

        if (this.SSidle) this.animations.SSIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y);


    } else {
        if (this.idle) this.animations.nIdle.drawFrame(this.game.clockTick, ctx, this.x, this.y);



        if (this.flyingRight && this.flyingUp) this.animations.nFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y -= 5);
        else if (this.flyingRight && this.flyingDown) this.animations.nFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y += 5);
        else if (this.flyingRight) this.animations.nFlyRight.drawFrame(this.game.clockTick, ctx, this.x += 15, this.y);


        if (this.flyingLeft && this.flyingUp) this.animations.nFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y -=5);
        else if (this.flyingLeft && this.flyingDown) this.animations.nFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y +=5);
        else if (this.flyingLeft) this.animations.nFlyLeft.drawFrame(this.game.clockTick, ctx, this.x -= 15, this.y);

        if (this.y < 410 && this.flyingDown && !this.flyingLeft && !this.flyingRight) this.animations.nFlyDown.drawFrame(this.game.clockTick, ctx, this.x, this.y += 5);
        if (this.flyingUp && !this.flyingLeft && !this.flyingRight) this.animations.nFlyUp.drawFrame(this.game.clockTick, ctx, this.x, this.y -= 5);

    }



    Entity.prototype.draw.call(this);
}


//END GOKU


function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 0, 0, 206, 110, 0.02, 30, true, true);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/RobotUnicorn.png"), 618, 334, 174, 138, 0.02, 40, false, true);
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

//ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
ASSET_MANAGER.queueDownload("./img/GreenRanger.png");
ASSET_MANAGER.queueDownload("./img/customGoku.png");
ASSET_MANAGER.queueDownload("./img/GokuTrans.png");




ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    //var unicorn = new Unicorn(gameEngine);
    var powerRanger = new PowerRanger(gameEngine);
    var goku = new Goku(gameEngine);

    gameEngine.addEntity(bg);
    //gameEngine.addEntity(unicorn);
    gameEngine.addEntity(goku);

    gameEngine.init(ctx);
    gameEngine.start();
});
