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
    .catch((err) => res.json({status: 400, 'Error': 'invalid login!'}))
})

// Returns active and pending game ids for the user as separate arrays
app.get('/games/:user', function(req, res) {
  User.findById(req.params.user, function(err, user) {
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

// A personalized view of the game for a specific user...
app.get('/games/:game?user', function(req, res) {

})

// Send arrays of the user's friends and friend requests back
app.get('/friends/:user', function(req, res) {
  User.findById(req.params.user)
    .then((user) => res.send({friends: user.friends, requests: user.requests}))
})

// Returns the user object (for loading friends, profile page etc)
app.get('/users/:user', function(req, res) {
  User.findById(req.params.user, function(err, user) {
    res.send(user)
  })
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
      invited: []
    },
    createdAt: new Date(),
    owner: req.params.user,
    gameStatus: 'Pending'
  })
  var userId = req.params.user
  newGame.save((err, game) => {
    User.findById(userId, function(err, user) {
      var pendingGames = user.games.pending;
      var activeGames = user.games.active;
      let id = game.id
      pendingGames.push(id)
      User.findByIdAndUpdate(userId, {games: {active: activeGames, pending: pendingGames}})
        .then(res.send('success'))
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
        .then(res.send('Game started!'))
    })
})

// Turns the user's game status from pending to active. Takes 'game' query that
// refers to the game that is being initialized
app.get('/games/initializeuser/:user', function(req, res) {
  User.findById(req.params.user)
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
        .then(res.send('Players are ready...'))
    })
})

// Adds the game to selected player's invited to field. Requires a 'user' query
// that is the user's ID
app.post('/games/inviteplayer/:game', function(req, res) {
  User.findById(req.query.user)
    .then((user) => {
      let invitedGames = user.games.invitedTo;
      invitedGames.push(req.params.game)
      User.findByIdAndUpdate(user._id, {games:
        {
          active: user.games.active,
          pending: user.games.pending,
          invitedTo: invitedGames,
          ended: user.games.ended
        }
      }, function(err, user) {
        Game.findById(req.params.game, function(err, game) {
          invitedPlayers = game.participants.invited;
          joinedPlayers = game.participants.joined;
          invitedPlayers.push(req.query.user)
          Game.findByIdAndUpdate(req.params.game, {participants: {joined: joinedPlayers, invited: invitedPlayers}})
            .then(res.json('Invited to game!'))
        })
      })
    })
})

// Moves the game from 'invited to' into 'pending' for the user who accepted it
// requires a 'user' query that is the user's ID as well
app.post('/games/acceptgame/:game', function(req, res) {
  User.findById(req.query.user)
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
          joinedPlayers.push(req.query.user)
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

app.get('/ping', function(req, res) {
  return res.send('pong');
})

app.listen(process.env.PORT || 1337);
