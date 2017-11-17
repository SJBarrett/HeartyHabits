// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    scaleRatio = window.devicePixelRatio / 3;

    //Create a new game instance and assign it to the 'gameArea' div
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

    // var game = new Phaser.Game(window.innerWidth*window.devicePixelRatio, (window.innerHeight*window.devicePixelRatio) - 45 * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('background','assets/debug-grid-1920x1920.png');
        game.load.image('player','assets/sprites/phaser-dude.png');

    }

    var player;
    var cursors;
    var clickX;
    var clickY;

    function create() {

        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        game.physics.arcade.enable(player);
        player.body.fixedRotation = true;
        cursors = game.input.keyboard.createCursorKeys();
        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        game.input.onTap.add(onTap, this);
    }

    function  onTap(pointer, doubleTap){

      clickX = pointer.x;
      clickY = pointer.y;
    }

    function update() {
      if(game.input.activePointer.isDown){
        console.log("Pointer (" + (game.input.activePointer.positionDown.x + game.camera.x)+ "," + (game.input.activePointer.positionDown.y + game.camera.y) + ")");
        clickX = game.input.activePointer.positionDown.x + game.camera.x;
        clickY = game.input.activePointer.positionDown.y + game.camera.y;
        console.log("Player (" + player.position.x + "," + player.position.y + ")");
        console.log("DISTANCE: " + Math.sqrt((player.position.x - clickX)*(player.position.x - clickX) + (player.position.y - clickY)*(player.position.y - clickY)));
        game.physics.arcade.moveToXY(player, clickX, clickY, 100);
      }
      var distance = Math.sqrt((player.position.x - clickX)*(player.position.x - clickX) + (player.position.y - clickY)*(player.position.y - clickY));
      if(distance < 50){
        player.body.velocity.setTo(0,0);
        console.log("ARRIVED");
      }
    }

    function render() {

        game.debug.cameraInfo(game.camera, 32, 32);

    }


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
