(function(){
  var app = angular.module('dartGame', [
    'ui.router'
  ]);

  app.controller('lobbyCtrl', lobbyCtrl);
  app.controller('gameCtrl', gameCtrl);
  app.factory('gameSvc', gameSvc);
  app.config(configStates);

  configStates.$inject = ['$stateProvider', '$urlRouterProvider'];
  function configStates($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('', '/lobby');
		$urlRouterProvider.when('/', '/lobby');

    $stateProvider
    .state('lobby', {
      url: '/lobby',
      templateUrl: './pages/lobby.html',
      controller: 'lobbyCtrl',
      data: {
        pageTitle: 'Lobby'
      }
    })
    .state('game', {
      url: '/game',
      templateUrl: './pages/game.html',
      controller: 'gameCtrl',
      data: {
        pageTitle: 'Game'
      }
    })
    ;
  }

  lobbyCtrl.$inject = ['$scope', '$state', 'gameSvc'];
  function lobbyCtrl($scope, $state, gameSvc){
    $scope.state = 'lobby';
    $scope.players = [];
    $scope.addPlayer = function(name){

      var checkName = $scope.players.some(function(pl){
        return pl.name === name;
      });

      if (checkName) {
        alert('JA EXISTE ALGUEM COM ESSE NOME: ', name);
      } else {
        $scope.players.push({name:name, rounds:{}, totalScore:0});
        $scope.playerName = '';
      }
    }

    $scope.startGame = function(players){
      gameSvc.players = players;
      $state.go('game');
    }
  }

  gameCtrl.$inject = ['$scope', 'gameSvc'];
  function gameCtrl($scope, gameSvc){
    $scope.players = gameSvc.players;
    $scope.numRounds = 5;
    $scope.rounds = function(){
      var rounds = [];
      for (var i = 0; i < $scope.numRounds; i++) {
        rounds.push(i);
        $scope.players = $scope.players.map(function(pl){
          pl.rounds[i] = {total:0, edit:false};
          return pl;
        });
      }
      return rounds;
    }();

    $scope.makeTotal = function(pl){
      var total = 0;
      for (var i = 0; i < $scope.numRounds; i++) {
         total += +pl.rounds[i].total;
      }
      pl.totalScore = total;
    };

    // $scope.editRound = function(player, round){
    //   player.rounds[round].edit = true;
    //   window.addEventListener('click', makeFalse);
    //
    //   function makeFalse(){
    //     console.count();
    //     player.rounds[round].edit = false;
    //     window.removeEventListener('click', makeFalse);
    //   }
    // };

  }


  gameSvc.$inject = [];
  function gameSvc(){
    var svc = {};
    svc.players = [];

    return svc;
  }

})();
