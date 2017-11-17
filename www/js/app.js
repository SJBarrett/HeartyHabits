// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    var config = {
     apiKey: "AIzaSyBWc3hKNxyfjQd59up3GtAxVe6etF4XZAU",
     authDomain: "hearty-bf306.firebaseapp.com",
     databaseURL: "https://hearty-bf306.firebaseio.com",
     projectId: "hearty-bf306",
     storageBucket: "hearty-bf306.appspot.com",
     messagingSenderId: "1015399047405"
    };

    firebase.initializeApp(config);

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

        game.input.onDown.add(movePlayer, this);
    }

    function movePlayer(){
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
      game.physics.arcade.moveToXY(player, game.input.activePointer.x, game.input.activePointer.y, 100);
    }

    function update() {
      if(game.physics.arcade.distanceToPointer(player) < 50){
        player.body.velocity.setTo(0,0);
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
