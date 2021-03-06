angular.module('clockworkproxy')
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'js/app.html',
    controller: 'AppCtrl as appCtrl',
    resolve: {
      Register: function (Crypto, Keys, ClockworkProxy, $ionicLoading) {
        // Check if the app has registered
        if (!Keys.isRegistered()) {
          console.log('Not registered, registering.');

          return $ionicLoading
            .show({ template: 'Registering...' })
            .then(function () {

              // 1. Set the public key of our server
              var serverPublicKey = Crypto.getKeyFromPEM((
                '-----BEGIN PUBLIC KEY-----' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCau3e35dOtNGX9b772JIiSoxGt' +
                '0VsBsI96V8FEgPCLT56mGR5Gfwf3qiZebU+pmK2OlQh857qZtWd6Gr9zW59NDZwH' +
                'bjLl7K3+5s0BgV+grQ4LbrC4/1gE8fjj7i1NBIuIgrn4TcxuohNsRCzP/yp5CNg0' +
                'iX4KjfDYKyYK2g0fEQIDAQAB' +
                '-----END PUBLIC KEY-----'
              ));

              Keys.setServerPublicKey(serverPublicKey);

              // 2. Generate a key pair for this device
              var myKeyPair = Crypto.generateKeyPair();

              // 3. Store the key pair locally
              Keys.setMyPublicKey(myKeyPair.pubKeyObj);
              Keys.setMyPrivateKey(myKeyPair.prvKeyObj);

              // 4. Send the Registration message
              return ClockworkProxy.register(myKeyPair.pubKeyObj);
            })
            .finally(function () {
              return $ionicLoading.hide();
            });
        } else {
          console.log('Already Registered!');
          // var myPublicKey = Keys.getMyPublicKey();
          // console.log(myPublicKey.encrypt('another message here'));
        }
      }
    }
  })

  .state('app.messages', {
    url: '/messages',
    views: {
      main: {
        templateUrl: 'js/messages/messages.html',
        controller: 'MessagesCtrl as $ctrl'
      }
    }
  })
  .state('app.message', {
    url: '/message/:id',
    views: {
      main: {
        templateUrl: 'js/message/message.html',
        controller: 'MessageCtrl as $ctrl'
      }
    }
  })
  .state('app.create', {
    url: '/create',
    views: {
      main: {
        templateUrl: 'js/create/create.html',
        controller: 'CreateCtrl as $ctrl'
      }
    }
  })
  .state('app.preferences', {
    url: '/preferences',
    views: {
      main: {
        templateUrl: 'js/preferences/preferences.html',
        controller: 'PreferencesCtrl as $ctrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/messages');
});
