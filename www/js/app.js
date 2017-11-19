// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngGeolocation'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, $geolocation) {
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

        game.load.image('background','assets/platformerMap.png');
        // game.load.image('player','assets/sprites/phaser-dude.png');

        // this.load.spritesheet('player', 'img/george.png', 48, 48, 16);
        this.load.spritesheet('bee', 'img/bee.png', 60, 65, 11);
        this.load.spritesheet('cakethulhu', 'assets/Cakethulhu.png', 128, 141);

        this.load.spritesheet('player', 'assets/platformer/spritesheet.png', 72, 97, 11);
    }

    var player;
    var cursors;
    var clickX;
    var clickY;
    var moveDirection; // 0 up, 1 right, 2 down, 3 left

    var inBattle = false;

    function create() {

        game.add.tileSprite(0, 210, 5250, 1050, 'background');
        game.world.setBounds(0, 0, 5250, 1050);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.scale.setTo(0.5,0.5);
        game.stage.backgroundColor = "#87b5ff";



        player = game.add.sprite(game.world.centerX, 700, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.enableBody = true;
        player.collideWorldBounds = true;
        this.physics.enable(player, Phaser.Physics.ARCADE);

        bee = game.add.sprite(player.x + 225, player.y, 'cakethulhu');
        bee.anchor.setTo(0.5, 0.5);
        bee.enableBody = true;
        bee.collideWorldBounds = true;
        this.physics.enable(bee, Phaser.Physics.ARCADE);

        this.walk = player.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10]);
        // this.left = player.animations.add('left', [1, 5, 9, 13]);
        // this.up = player.animations.add('up', [2, 6, 10, 14]);
        // this.right = player.animations.add('right', [3, 7, 11, 15]);
        // this.still = player.animations.add('still', [2]);

        // this.walkBee = bee.animations.add('walkBee', [0, 1, 2]);
        // this.leftBee = bee.animations.add('leftBee', [3, 4, 5]);
        // this.rightBee = bee.animations.add('rightBee', [6, 7, 8]);
        // this.upBee = bee.animations.add('upBee', [9, 10, 11]);
        // this.stillBee = bee.animations.add('stillBee', [0]);



        game.physics.arcade.enable(player);
        player.body.fixedRotation = true;
        cursors = game.input.keyboard.createCursorKeys();
        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        moveEveryone();
        $rootScope.canbattle = 1
    }

    function update() {
      game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

      $geolocation.getCurrentPosition().then(function(position) {
          console.log(position.coords.latitude + ", " + position.coords.longitude);
       });

      if (this.physics.arcade.overlap(player, bee)) {

        if($rootScope.canbattle == 1){
          $rootScope.canbattle = 2

          $ionicPopup.alert({
            template: "Battle the Sugar Bee?",
            cssClass: 'adminpop',
            buttons: [{
                text: 'Battle',
                onTap: function(e) {
                  battle()
                }
            }, {
                text: 'Bail',
                type: 'button-positive',
                onTap: function(e) {

                    $ionicPopup.alert({
                      template: "Walk 5km to continue",
                      cssClass: 'adminpop'
                    });

                    // $rootScope.canbattle = 1

                }
            }]
          });
        }

      }

      if(game.input.activePointer.isDown && inBattle == false){
        clickX = game.input.activePointer.positionDown.x + game.camera.x;
        clickY = game.input.activePointer.positionDown.y + game.camera.y;
        game.physics.arcade.moveToXY(player, clickX, player.y, 100);
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
      if(inBattle == false){
        if($rootScope.moveNum == 1){
          bee.x -= 0.2;
          bee.animations.play('leftBee', 3);
        }else if($rootScope.moveNum == 2){
          bee.x += 0.2;
          bee.animations.play('rightBee', 3);
        }else if($rootScope.moveNum == 3){
          bee.y = player.y + Math.random() / 5;
          bee.animations.play('walkBee', 3);
        }else if($rootScope.moveNum == 4){
          bee.y = player.y - Math.random() / 5;
          bee.animations.play('upBee', 3);
        }
      }
      if(moveDirection == 0){
        player.animations.play('walk', 5);
      } else if (moveDirection == 1) {
        player.animations.play('walk', 5);
      } else if (moveDirection == 2) {
        player.animations.play('walk', 5);
      } else if (moveDirection == 3) {
        player.animations.play('walk', 5);
      }else{
        player.animations.stop(null, true);
      }

    }

    function render() {
        // game.debug.cameraInfo(game.camera, 32, 32);
    }

    function battle() {
      console.log('battle');
      inBattle = true;
      $rootScope.moveNum = 30;
      bee.y = player.y - 70;
      bee.x = player.x;
      player.body.velocity.setTo(0,0);
      bee.animations.play('stillBee', 3);
      player.animations.stop();
      player.animations.play('still', 4);

      // Build the buttons
      attackButton = game.add.button(game.world.centerX, game.world.centerY,
        'button', attackAction, this, 1, 0, 2);
      attackButton.anchor.setTo(0.5,0.5);

      game.world.scale.set(3,3);
    }

    function attackAction(){
      button.setFrames()
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
