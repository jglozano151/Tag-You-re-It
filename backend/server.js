// Require node modules
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MLAB);

// Database schema
const User = mongoose.model('User', {
  username: String,
  password: String,
  friends: Array,
  requests: Array,
  games: {
    active: Array,
    pending: Array,
    invitedTo: Array,
    ended: Array
  },
  location: {
    latitude: String,
    longitude: String
  }
})

const Game = mongoose.model('Game', {
  title: String,
  participants: {
    joined: Array,
    invited: Array,
  },
  createdAt: Date,
  owner: String,
  gameStatus: String,
  it: Array
})

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('ping');
})

// Returns a status that says 'registered' if successful and puts the new user in the database
app.post('/register', function(req, res) {
  let newUser = new User({username: req.body.username, password: req.body.password})
  newUser.save()
    .then(res.json({status: 200, message: "Registered!"}))
    .catch((err) => res.json({status: 'Error: ' + err}))
})

// Returns the user object and a status of successful if the login info is valid
app.post('/login', function(req, res) {
  User.findOne({username: req.body.username, password: req.body.password})
    .then((user) => {
      if (user) {
        res.json({status: 200, message: 'Login success!', user: user})
      }
    })
    .catch((err) => res.json({status: 400, message: 'Error: invalid login!'}))
})

// Returns active and pending game ids for the user as separate arrays
app.get('/userGames/:user', function(req, res) {
  User.findById(req.params.user, function(err, user) {
    console.log('Test', user);
    res.send({
      active: user.games.active,
      pending: user.games.pending,
      invitedTo: user.games.invitedTo,
      ended: user.games.ended
    })
  })
})

// Returns the game object when the game id is provided as a parameter
app.get('/:game', function(req, res) {
  Game.findById(req.params.game, function(err, game) {
    res.send(game)
  })
})

// Send arrays of the user's friends and friend requests back
app.get('/friends/:user', function(req, res) {
  User.findById(req.params.user)
    .then((user) => {
      let friends = user.friends
      let requests = user.requests
      var friendObjects = []
      var requestObjects = []
      Promise.all(
        friends.map((friend) => {
          return User.findOne({username: friend})
        })
      )
        .then((friends) => res.send({status: 200, friends: friends}))
        .catch((err) => res.send({status: 400, message: err}))
    })
    .catch((err) => res.send({status: 400, message: err}))
})

// Add friend, pass in the body the username of the friend you want to send the request to
app.post('/friends/addFriend/:user', function(req, res){
  User.findById(req.params.user)
    .then((user) => {
      let friends = user.friends
      var username = user.username
      friends.push(req.body.friend)
      User.findByIdAndUpdate(req.params.user, {friends: friends})
        .then(User.findBy({username: req.body.friend})
          .then((friend) => {
            let newRequests = friend.requests
            newRequests.push(username)
            User.findByIdAndUpdate(req.body.friend, {requests: newRequests})
              .then(res.send({status: 200}))
              .catch((err) => res.send({status: 400, message: err}))
          })
          .catch((err) => res.send({status: 400, message: err}))
        )
        .catch((err) => res.send({status: 400, message: err}))
    })
    .catch((err) => res.send({status: 400, message: err}))
})

// Allows the user to accept a specific friend request. Takes a body element 'request' that
// is the username of the user who sent the request
app.post('/friends/acceptrequest/:user', function(req, res) {
  User.findById(req.params.user)
    .then((user) => {
      let newRequests = user.requests
      let newFriends = user.friends
      for (let i = 0; i < newRequests.length; i++) {
        if (req.query.request === newRequests[i]) {
          newRequests.splice(newRequests.indexOf(req.query.request), 1)
          newFriends.push(req.body.request)
        }
      }
      User.findByIdAndUpdate(req.params.user, {friends: newFriends, requests: newRequests})
        .then(res.send({status: 200, message: 'accepted'}))
    })
})

// Creates a new game with the person who created it as the owner *** Working
app.post('/games/creategame/:user', function(req, res) {
  let newGame = new Game({
    title: req.body.title,
    participants: {
      joined: [req.params.user],
      invited: [],
      createdAt: new Date(),
  },
    owner: req.params.user,
    gameStatus: 'Pending'
  })
  var userId = req.params.user
  newGame.save((err, game) => {
    let newTagGame = game
    User.findById(userId, function(err, user) {
      if (err) {
        res.send({status: 500, message: err})
      }
      var pendingGames = user.games.pending;
      var activeGames = user.games.active;
      let id = game.id
      pendingGames.push(id)
      User.findByIdAndUpdate(userId, {games: {
        active: activeGames, pending: pendingGames, invitedTo: user.games.invitedTo, ended: user.games.ended
      }})
        .then(res.send({status: 200, message: 'Game created!', game: newTagGame}))
        .catch((err) => res.send({status: 400, message: err}))
    })
  })
})

// Initializes the game
app.get('/games/initialize/:game', function(req, res) {
  Game.findById(req.params.game)
    .then((game) => {
      let participants = game.participants.joined;
      let newIt = participants[Math.floor(Math.random()*participants.length)]
      Game.findByIdAndUpdate(req.params.game, {gameStatus: 'active', it: [newIt]})
        .then(res.json({status: 200, message: 'Game started!'}))
        .catch((err) => res.json({status: 400, message: err}))
    })
    .catch((err) => res.json({status: 400, message: err}))
})

// Turns the user's game status from pending to active. Takes 'game' query that
// refers to the game that is being initialized
app.post('/games/initializeusers', function(req, res) {
  // fix this to run for all users in the game
  let users = req.body.players
  User.findById(user)
    .then((user) => {
      let activeGames = user.games.active;
      let pendingGames = user.games.pending;
      activeGames.push(req.query.game);
      pendingGames.splice(pendingGames.indexOf(req.query.game), 1)
      User.findByIdAndUpdate(req.params.user, {
        games: {
          active: activeGames,
          pending: pendingGames,
          invitedTo: user.games.invitedTo,
          ended: user.games.ended
        }
      })
        .then(res.json({status: 200, message: 'Players ready'}))
        .catch((err) => res.json({status: 400, message: err}))
    })
})

// Adds the game to selected player's invited to field. Requires a 'user' query
// that is the user's ID


app.post('/games/inviteplayers', function(req, res) {
  let players = req.body.players
  // Fix this like above!
  User.findById(req.body.user)
    .then((user) => {
      let invitedGames = user.games.invitedTo;
      invitedGames.push(req.body.game)
      User.findByIdAndUpdate(user._id, {games:
        {
          active: user.games.active,
          pending: user.games.pending,
          invitedTo: invitedGames,
          ended: user.games.ended
        }
      }, function(err, user) {
        Game.findById(req.body.game, function(err, game) {
          invitedPlayers = game.participants.invited;
          joinedPlayers = game.participants.joined;
          invitedPlayers.push(req.body.user)
          Game.findByIdAndUpdate(req.body.game, {participants: {joined: joinedPlayers, invited: invitedPlayers}})
            .then(res.json({status: 200, message: 'Invited to game'}))
            .catch((err) => res.json({status: 400, message: err}))
        })
      })
    })
})

app.get('/games/:game', function(req, res) {
  Game.findById(req.params.game)
    .then((game) => {
      User.findById(game.owner.id, function(err, user) {
        if (err) {
          res.send({status: 400, message: err})
        }
        res.send({status: 200, message: 'Found', game: game, owner: user})
      })
    })
    .catch((err) => res.send({status: 400, message: err}))
})

// Moves the game from 'invited to' into 'pending' for the user who accepted it
// requires a 'user' query that is the user's ID as well
app.post('/games/acceptgame/:game', function(req, res) {
  User.findById(req.body.user)
    .then((user) => {
      let invitedGames = user.games.invitedTo;
      let pendingGames = user.games.pending;
      for (let i = 0; i < user.games.invitedTo.length; i++) {
        if (user.games.invitedTo[i] === req.params.game) {
          invitedGames.splice(i, 1);
          pendingGames.push(req.params.game)
        }
      }
      User.findByIdAndUpdate(user._id, {games:
        {
          active: user.games.active,
          pending: pendingGames,
          invitedTo: invitedGames,
          ended: user.games.ended
        }
      }, function(err, user) {
        Game.findById(req.params.game, function(err, game) {
          invitedPlayers = game.participants.invited;
          joinedPlayers = game.participants.joined;
          invitedPlayers.splice(invitedPlayers.indexOf(user._id), 1)
          joinedPlayers.push(req.body.user)
          Game.findByIdAndUpdate(req.params.game, {participants: {joined: joinedPlayers, invited: invitedPlayers}})
            .then(res.json('Accepted game!'))
        })
      })
    })
})

// Add a new tag, by passing in the user to be tagged as a query. This post will
// update the tags array and also return game status, with 'completed' if the game is over.
// at this point, frontend should do a 'get' to games/endgame/:game to end the game
// for each user (passed in as query)
app.post('/games/newtag/:game', function(req, res) {
  Game.findById(req.params.game)
    .then((game) => {
      let itPlayers = game.it
      itPlayers.push(req.query.user)
      let status = game.gameStatus
      if (game.it.length === game.participants.length - 1) {
        status = 'completed'
      }
      Game.findByIdAndUpdate(req.params.game, {it: itPlayers, gameStatus: status}, function(err, game) {
        res.send({gamestatus: game.gameStatus})
      })
    })
})

// A request must be made here for each user in the game after the game status is 'completed'
// pass in the user as a query.
app.post('/games/endgame/:game', function(req, res) {
  User.findById(req.query.user)
    .then((user) => {
      let activeGames = user.games.active;
      let endedGames = user.games.ended;
      endedGames.push(req.params.game);
      activeGames.splice(activeGames.indexOf(req.params.game), 1)
      User.findByIdAndUpdate(req.query.user, {
        games: {
          active: activeGames,
          pending: user.games.pending,
          invitedTo: user.games.invitedTo,
          ended: endedGames
        }
      })
        .then(res.send('Players are ready...'))
    })
})

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
  if (unit=="Meter") { dist = dist * 1609.34}
	return dist
}

app.post('/livegame/:game', function(req, res){
  User.findByIdAndUpdate(req.body.id, {
    location: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }
  })
    .then(Game.findById(req.params.game))
    .then((game) => {
      let playerIds = game.participants.joined
      let itIds = game.it
      Promise.all(
        playerIds.map((playerId) => {
          return (User.findById(playerId))
        })
      )
        .then((players) => {
          let itPlayers = []
          let notItPlayers = []
          let updatedNotItPlayers = []
          players.forEach(function(player){
            if(itIds.indexOf(player.id) > -1){
              itPlayers.push(player)
            } else{
              notItPlayers.push(player)
            }
          })
          for (let i = 0; i < itPlayers.length; i++){
            for (let j = 0; j < notItPlayers.length; j++){
              if (distance(itPlayers[i].position.latitude, itPlayers[i].position.longitude, notItPlayers[j].position.latitude, notItPlayers[j].position.longitude, 'Meter') < 5){
                itIds.push(notItPlayers[j].id)
                itPlayers.push(notItPlayers[j])
              }
            }
          }
          notItPlayers.forEach(function(element){
            let match = false
            for (let i = 0; i < itPlayers.length; i++){
              if (element.id === itPlayers.id){
                match = true
              }
            }
            if (!match){
              updatedNotItPlayers.push(element)
            }
            match = false
          })
          Game.findByIdAndUpdate(req.params.game, {it: itIds})
            .then(() => {
              res.json({status: 200, message: 'Updated', itPlayers: itPlayers, notItPlayers: updatedNotItPlayers})
            })
            .catch((err) => res.json({status: 400, message: err}))
        })
        .catch((err) => res.json({status: 400, message: err}))
    })
    .catch((err) => res.json({status: 400, message: err}))
})

app.get('/ping', function(req, res) {
  return res.send('pong');
})

app.listen(process.env.PORT || 1337);
