// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.run(function($ionicPlatform, $rootScope) {
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

        game.load.image('background','img/grass.png');
        // game.load.image('player','assets/sprites/phaser-dude.png');
<<<<<<< HEAD
        this.load.spritesheet('player', 'img/george.png', 40, 50, 16);
        this.load.spritesheet('gameSprite', 'img/roguelikeSheet_transparent.png', 16, 16, 1736, 0, 1);
=======
        this.load.spritesheet('player', 'img/george.png', 48, 48, 16);
        this.load.spritesheet('bee', 'img/bee.png', 60, 65, 11);
>>>>>>> 1c5e9a24c03de93e10887bddc70e228af301aaa5
    }

    var player;
    var cursors;
    var clickX;
    var clickY;
    var moveDirection; // 0 up, 1 right, 2 down, 3 left

    function create() {

        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);
        game.physics.startSystem(Phaser.Physics.ARCADE);


        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        randomBeePosX = Math.random() * (window.innerWidth - 1) + 1;
        randomBeePosY = Math.random() * (window.innerWidth - 1) + 1;

        bee = game.add.sprite(game.world.centerX, game.world.centerY, 'bee');
        bee.anchor.setTo(0.5, 0.5);
        player.anchor.setTo(0.5, 0.5);
        this.walk = player.animations.add('walk', [0, 4, 8, 12])
        this.left = player.animations.add('left', [1, 5, 9, 13])
        this.up = player.animations.add('up', [2, 6, 10, 14])
        this.right = player.animations.add('right', [3, 7, 11, 15])

        this.walkBee = bee.animations.add('walkBee', [0, 1, 2])
        this.leftBee = bee.animations.add('leftBee', [3, 4, 5])
        this.rightBee = bee.animations.add('rightBee', [6, 7, 8])
        this.upBee = bee.animations.add('upBee', [9, 10, 11])

        game.physics.arcade.enable(player);
        player.body.fixedRotation = true;
        cursors = game.input.keyboard.createCursorKeys();
        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


        moveEveryone();
    }

    function update() {
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      if(game.input.activePointer.isDown){
        clickX = game.input.activePointer.positionDown.x + game.camera.x;
        clickY = game.input.activePointer.positionDown.y + game.camera.y;
        game.physics.arcade.moveToXY(player, clickX, clickY, 100);
        var distX = clickX - player.position.x;
        var distY = clickY - player.position.y;
        // moving left or right
        if(Math.abs(distX) > Math.abs(distY)){
          if(distX > 0){
            moveDirection = 1;
          } else {
            moveDirection = 3;
          }
        } else {
          if(distY > 0){
            moveDirection = 2;
          } else {
            moveDirection = 0;
          }
        }

      }

      var distance = Math.sqrt((player.position.x - clickX)*(player.position.x - clickX) + (player.position.y - clickY)*(player.position.y - clickY));

      if(distance < 5) {
        player.body.velocity.setTo(0,0);
        player.animations.stop(null, true);
      }


      if(player.body.velocity < 50){
        player.animations.play('walk', 4);
      }

      if($rootScope.moveNum == 1){
        bee.x -= 1;
        bee.animations.play('leftBee', 3);
      }else if($rootScope.moveNum == 2){
        bee.x += 1;
        bee.animations.play('rightBee', 3);
      }else if($rootScope.moveNum == 3){
        bee.y += 1;
        bee.animations.play('walkBee', 3);
      }else if($rootScope.moveNum == 4){
        bee.y -= 1;
        bee.animations.play('upBee', 3);
      }

      if(moveDirection == 0){
        player.animations.play('up', 5);
      } else if (moveDirection == 1) {
        player.animations.play('right', 5);
      } else if (moveDirection == 2) {
        player.animations.play('walk', 5);
      } else {
        player.animations.play('left', 5);
      }

    }

    function render() {
        // game.debug.cameraInfo(game.camera, 32, 32);
    }

    function moveEveryone(){
        $rootScope.moveNum = Math.floor(Math.random() * (5 - 1) + 1);
        setTimeout(moveEveryone, 3000);
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
