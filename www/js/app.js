// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngGeolocation', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, $geolocation, $ionicLoading, $firebaseObject, $cordovaBarcodeScanner) {
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

      var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

      function preload() {
          game.load.image('background','assets/platformerMap.png');
          game.load.image('shrub', 'img/shrub.png');
          game.load.image('pineTree','img/tree1.png');
          game.load.image('palmTree', 'img/tree2.png');
          game.load.image('basicTree', 'img/tree3.png');
          this.load.image('heart', 'img/heart.png');

          this.load.spritesheet('gameSprite', 'img/roguelikeSheet_transparent.png', 16, 16, 1736, 0, 1);
          // this.load.spritesheet('player', 'img/george.png', 48, 48, 16);
          this.load.spritesheet('bee', 'img/bee.png', 60, 65, 11);

          this.load.spritesheet('cakethulhu', 'assets/Cakethulhu.png', 128, 141);

          this.load.spritesheet('player', 'assets/platformer/spritesheet.png', 72, 97, 11);
        }

        var player;
        var cursors;
        var clickX;
        var clickY;
        var moveDirection;
        var rightKey;

        var inBattle = false;

        function create() {

          game.add.tileSprite(0, 400, 5250, 1050, 'background');
          game.world.setBounds(0, 0, 5250, 1050);
          game.physics.startSystem(Phaser.Physics.ARCADE);
          game.world.scale.setTo(1,1);
          game.stage.backgroundColor = "#87b5ff";

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
            this.scale.pageAlignHorizontally = true;

            // this.circles = game.add.graphics(game.world.centerX, game.world.centerY);
            // this.circles.beginFill(0xD24D57, 1);
            // this.circles.drawCircle(0, 0, 50);
            // this.circles.anchor.setTo(0.5, 0.5);
            // this.circles.enableBody = true;
            // this.circles.collideWorldBounds = true;
            // this.physics.enable(this.circles, Phaser.Physics.ARCADE);



            player = game.add.sprite(100, 878, 'player');
            player.anchor.setTo(0.5, 0.5);
            player.enableBody = true;
            player.collideWorldBounds = true;
            this.physics.enable(player, Phaser.Physics.ARCADE);

            this.heart = this.add.image(0, 0, 'heart');

            this.heart.x = 150;
            this.heart.y = this.game.height - 150;
            this.heart.height = 100;
            this.heart.width = 80;
            this.heart.fixedToCamera = true;
            this.heart.bringToTop();
            this.heart.anchor.setTo(0.5, 0.5);
            this.heart.inputEnabled = true;
            this.heart.events.onInputDown.add(pressCompass, this);

            randomBeePosX = Math.random() * (game.world.centerX + 300 - (game.world.centerX - 300)) + (game.world.centerX - 300);
            randomBeePosY = Math.random() * (game.world.centerY + 300 - (game.world.centerY - 300)) + (game.world.centerY - 300);

            bee = game.add.sprite(player.x + 800, player.y, 'cakethulhu');
            bee.anchor.setTo(0.5, 0.5);
            bee.enableBody = true;
            bee.collideWorldBounds = true;
            this.physics.enable(bee, Phaser.Physics.ARCADE);

            this.walk = player.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10]);
            // this.left = player.animations.add('left', [1, 5, 9, 13])
            // this.up = player.animations.add('up', [2, 6, 10, 14])
            // this.right = player.animations.add('right', [3, 7, 11, 15])
            //
            // this.walkBee = bee.animations.add('walkBee', [0, 1, 2])
            // this.leftBee = bee.animations.add('leftBee', [3, 4, 5])
            // this.rightBee = bee.animations.add('rightBee', [6, 7, 8])
            // this.upBee = bee.animations.add('upBee', [9, 10, 11])

            game.physics.arcade.enable(player);
            player.body.fixedRotation = true;
            cursors = game.input.keyboard.createCursorKeys();

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            moveEveryone();
            $rootScope.canbattle = 1

            // var trees = [];
            // for ( i = 0; i < 10; i++){
            //   treePosX = Math.random() * (game.world.centerX + 500 - (game.world.centerX - 500)) + (game.world.centerX - 500);
            //   treePosY = Math.random() * (game.world.centerY + 500 - (game.world.centerY - 500)) + (game.world.centerY - 500);
            //   type = Math.floor(Math.random() * 4);
            //   if (type == 0){
            //     trees[i] = game.add.sprite(treePosX, treePosY, 'shrub');
            //   } else if (type == 1){
            //     trees[i] = game.add.sprite(treePosX, treePosY, 'pineTree');
            //   } else if (type == 2){
            //     trees[i] = game.add.sprite(treePosX, treePosY, 'palmTree');
            //   } else {
            //     trees[i] = game.add.sprite(treePosX, treePosY, 'basicTree');
            //   }
            // }
            $rootScope.level = 1;
            $rootScope.stepsToNextLevel = 10000;
            stepsText = game.add.text(game.world.centerX, game.world.centerY, 'Steps to next level: ' + $rootScope.stepsToNextLevel);
            stepsText.fixedToCamera = true;
            stepsText.cameraOffset.setTo(0, 0);

            rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        }

        function update() {
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            $geolocation.getCurrentPosition().then(function(position) {

                  setTimeout(function() {
                    this.lat1 = position.coords.latitude
                    this.lng1 = position.coords.longitude
                  }, 2000);

                  this.lat2 = position.coords.latitude
                  this.lng2 = position.coords.longitude

                  $rootScope.Latitude = Math.abs(this.lat1 - this.lat2)
                  $rootScope.Longitude = Math.abs(this.lng1 - this.lng2)

                  $rootScope.totalSpeed = Math.sqrt(($rootScope.Latitude * $rootScope.Latitude) + ($rootScope.Longitude * $rootScope.Longitude))
              });

              // if(!$rootScope.totalSpeed){
              //     $rootScope.thespeed = 0
              //     player.body.velocity.setTo(0, 0);
              //     player.animations.stop(null, true);
              //
              //     $ionicLoading.show({
              //       template: 'Loading...'
              //     })
              // }else{
              if(($rootScope.totalSpeed * 1000000) < 10 && rightKey.isDown == false){
                $rootScope.thespeed = 0
                player.body.velocity.setTo(0, 0);
                player.animations.stop(null, true);
              }else{
                player.animations.play('walk', 11);
                $ionicLoading.hide()
                $rootScope.thespeed = $rootScope.totalSpeed * 1000000
                if(rightKey.isDown){
                  game.physics.arcade.moveToXY(player, player.x + 1000, player.y, 100);
                } else {
                  game.physics.arcade.moveToXY(player, player.x + 1000, player.y, $rootScope.thespeed);
                }
                if ($rootScope.totalSpeed >= 0){
                  $rootScope.stepsToNextLevel -= $rootScope.totalSpeed;
                }
                if ($rootScope.stepsToNextLevel <= 0){
                  //Progress level
                  $rootScopelevel += 1;
                  $rootScope.stepsToNextLevel = 10000 * level;
                }
                stepsText.setText('Steps to next level: ' + $rootScope.stepsToNextLevel);
              }

              if (Math.abs(player.x - bee.x) < 50) {
                  if ($rootScope.canbattle == 1) {
                      $rootScope.canbattle = 2

                      $ionicPopup.alert({
                          template: "Battle Cakethulhu?",
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

                                  player.body.velocity.setTo(0, 0);
                                  player.animations.stop(null, true);


                                  var corepop = $ionicPopup.alert({
                                      title: "Walk to continue",
                                      template: "Your position : <br />" + $rootScope.posA + ", " + $rootScope.posB,
                                      cssClass: 'adminpops'
                                  });

                                  if ($rootScope.posA == $rootScope.posA + 10 && $rootScope.posB == $rootScope.posB + 10) {
                                    corepop.hide()
                                  }

                                  // $rootScope.canbattle = 1

                              }
                          }]
                      });
                  }
              }

            if (game.input.activePointer.isDown) {
                clickX = game.input.activePointer.positionDown.x + game.camera.x;
                clickY = game.input.activePointer.positionDown.y + game.camera.y;

                // game.physics.arcade.moveToXY(this.circles, clickX, clickY, 700);

                var distX = clickX - player.position.x;
                var distY = clickY - player.position.y;
            }

            var distance = Math.sqrt((player.position.x - clickX) * (player.position.x - clickX) + (player.position.y - clickY) * (player.position.y - clickY));

            if (distance < 5) {
                player.body.velocity.setTo(0, 0);
                player.animations.stop(null, true);
            }

            // var cirdistance = Math.sqrt((this.circles.position.x - clickX) * (this.circles.position.x - clickX) + (this.circles.position.y - clickY) * (this.circles.position.y - clickY));

            // if (cirdistance < 10) {
            //     this.circles.body.velocity.setTo(0, 0);
            // }


            if (player.body.velocity < 50) {
                player.animations.play('walk', 4);
            }

            if ($rootScope.moveNum == 1) {
                bee.x -= 0.2;
                bee.animations.play('leftBee', 3);
            } else if ($rootScope.moveNum == 2) {
                bee.x += 0.2;
                bee.animations.play('rightBee', 3);
            } else if ($rootScope.moveNum == 3) {
                bee.y += 0.2;
                bee.animations.play('walkBee', 3);
            } else if ($rootScope.moveNum == 4) {
                bee.y -= 0.2;
                bee.animations.play('upBee', 3);
            }


        }

        function render() {
            // game.debug.cameraInfo(game.camera, 32, 32);
            game.debug.text("Player Speed: " + $rootScope.thespeed, 32, 40, '#C91F37');

            game.debug.text("Core Speed: " + $rootScope.totalSpeed, 32, 60, '#C91F37');
            game.debug.text("Latitude: " + $rootScope.Latitude, 32, 80, '#C91F37');
            game.debug.text("Longitude: " + $rootScope.Longitude, 32, 100, '#C91F37');

        }

        function pressCompass() {
          cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                      "Result: " + result.text + "\n" +
                      "Format: " + result.format + "\n" +
                      "Cancelled: " + result.cancelled);
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
         );
        }


        function battle() {
            inBattle = true;
            $rootScope.moveNum = 30;
            bee.y = player.y - 70;
            bee.x = player.x;
            player.body.velocity.setTo(0,0);
            bee.animations.play('stillBee', 3);
            player.animations.stop();
            player.animations.play('still', 4);

            game.world.scale.set(3,3);
        }

        function moveEveryone() {
            $rootScope.moveNum = Math.floor(Math.random() * (3 - 1) + 1);
            setTimeout(moveEveryone, 3000);
        }

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
