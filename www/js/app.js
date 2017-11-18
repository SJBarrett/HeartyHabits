// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngGeolocation'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, $geolocation, $ionicLoading) {
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
        var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', {
            preload: preload,
            create: create,
            update: update,
            render: render
        });

        // var game = new Phaser.Game(window.innerWidth*window.devicePixelRatio, (window.innerHeight*window.devicePixelRatio) - 45 * window.devicePixelRatio, Phaser.CANVAS, 'gameArea', { preload: preload, create: create, update: update, render: render });

        function preload() {

            game.load.image('background', 'img/grass.png');
            // game.load.image('player','assets/sprites/phaser-dude.png');

            this.load.spritesheet('gameSprite', 'img/roguelikeSheet_transparent.png', 16, 16, 1736, 0, 1);
            this.load.spritesheet('player', 'img/george.png', 48, 48, 16);
            this.load.spritesheet('bee', 'img/bee.png', 60, 65, 11);

            this.load.image('heart', 'img/heart.png');
        }

        var player;
        var cursors;
        var clickX;
        var clickY;
        var moveDirection;

        function create() {

            game.add.tileSprite(0, 0, 1920, 1920, 'background');
            game.world.setBounds(0, 0, 1920, 1920);
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
            this.scale.pageAlignHorizontally = true;

            this.circles = game.add.graphics(game.world.centerX, game.world.centerY);
            this.circles.beginFill(0xD24D57, 1);
            this.circles.drawCircle(0, 0, 50);
            this.circles.anchor.setTo(0.5, 0.5);
            this.circles.enableBody = true;
            this.circles.collideWorldBounds = true;
            this.physics.enable(this.circles, Phaser.Physics.ARCADE);

            player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
            player.anchor.setTo(0.5, 0.5);
            player.enableBody = true;
            player.collideWorldBounds = true;
            this.physics.enable(player, Phaser.Physics.ARCADE);

            heart = this.add.image(0, 0, 'heart');

            heart.x = this.game.width + 5;
            heart.y = 300;
            heart.height = 200;
            heart.width = 130;
            heart.fixedToCamera = true;
            heart.bringToTop()


            randomBeePosX = Math.random() * (game.world.centerX + 300 - (game.world.centerX - 300)) + (game.world.centerX - 300);
            randomBeePosY = Math.random() * (game.world.centerY + 300 - (game.world.centerY - 300)) + (game.world.centerY - 300);

            bee = game.add.sprite(randomBeePosX, randomBeePosY, 'bee');
            bee.anchor.setTo(0.5, 0.5);
            bee.enableBody = true;
            bee.collideWorldBounds = true;
            this.physics.enable(bee, Phaser.Physics.ARCADE);

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

            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            moveEveryone();
            $rootScope.canbattle = 1
        }

        function update() {
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            $geolocation.getCurrentPosition().then(function(position) {
                $rootScope.posA = Math.abs(position.coords.latitude)
                $rootScope.posB = Math.abs(position.coords.longitude)

                setTimeout(function() {
                  this.lat1 = $rootScope.posA
                  this.lng1 = $rootScope.posB
                }, 100);

                  this.lat2 = $rootScope.posA
                  this.lng2 = $rootScope.posB

                  $rootScope.Latitude = Math.abs(this.lat1 - this.lat2 + 0.05)
                  console.log("FirstLat: " + $rootScope.Latitude)
              });

              if(!$rootScope.Latitude){
                  $rootScope.thespeed = 0
                  player.body.velocity.setTo(0, 0);
                  player.animations.stop(null, true);

                  $ionicLoading.show({
                    template: 'Loading...'
                  })
              }else{
                $ionicLoading.hide()
                $rootScope.thespeed = $rootScope.Latitude * 100
                game.physics.arcade.moveToXY(player, clickX, clickY, $rootScope.thespeed);
              }

              console.log($rootScope.thespeed)

              if (this.physics.arcade.overlap(player, bee)) {
                  if ($rootScope.canbattle == 1) {
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

                                  player.body.velocity.setTo(0, 0);
                                  player.animations.stop(null, true);

                                  console.log("Your position :" + $rootScope.posA + ", " + $rootScope.posB);

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

                game.physics.arcade.moveToXY(this.circles, clickX, clickY, 700);

                var distX = clickX - player.position.x;
                var distY = clickY - player.position.y;

                // moving left or right
                if (Math.abs(distX) > Math.abs(distY)) {
                    if (distX > 0) {
                        moveDirection = 1;

                        // player.x = player.x + Math.abs(position.coords.latitude) / 100;
                        // player.y = player.y + Math.abs(position.coords.latitude) / 100;

                    } else {
                        moveDirection = 3;
                    }
                } else {
                    if (distY > 0) {
                        moveDirection = 2;
                    } else {
                        moveDirection = 0;
                    }
                }

            }

            var distance = Math.sqrt((player.position.x - clickX) * (player.position.x - clickX) + (player.position.y - clickY) * (player.position.y - clickY));

            if (distance < 5) {
                player.body.velocity.setTo(0, 0);
                player.animations.stop(null, true);
            }

            var cirdistance = Math.sqrt((this.circles.position.x - clickX) * (this.circles.position.x - clickX) + (this.circles.position.y - clickY) * (this.circles.position.y - clickY));

            if (cirdistance < 10) {
                this.circles.body.velocity.setTo(0, 0);
            }


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

            if (moveDirection == 0) {
                player.animations.play('up', 5);
            } else if (moveDirection == 1) {
                player.animations.play('right', 5);
            } else if (moveDirection == 2) {
                player.animations.play('walk', 5);
            } else if (moveDirection == 3) {
                player.animations.play('left', 5);
            } else {
                player.animations.stop(null, true);
            }

        }

        function render() {
            // game.debug.cameraInfo(game.camera, 32, 32);

            game.debug.text("Player Speed: " + $rootScope.thespeed, 32, 40);

        }


        function battle() {
            console.log('battle')
        }

        function moveEveryone() {
            $rootScope.moveNum = Math.floor(Math.random() * (5 - 1) + 1);
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
