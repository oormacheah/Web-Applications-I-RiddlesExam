'use strict';

const express = require('express');

const bodyParser = require('body-parser'); // middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const morgan = require('morgan'); // for logging
const cors = require('cors');


const DBHandler = require('./components/dbHandler');
const dbHandler = new DBHandler('riddles.db');

const RiddleDAO = require('./components/riddleDAO');
const ReplyDAO = require('./components/replyDAO');
const UserDAO = require('./components/userDAO');

const riddleDAO = new RiddleDAO(dbHandler);
const replyDAO = new ReplyDAO(dbHandler);
const userDAO = new UserDAO(dbHandler);

const UserAuth = require('./components/userAuth');
const userAuth = new UserAuth(dbHandler.db);

// init express
const app = new express();
const port = 3001;

// Passport 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const Riddle = require('./Riddle');
const Reply = require('./Reply');
const User = require('./User');

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userAuth.getUserHashCheck(username, password);
  if (!user) {
    return cb(null, false, 'Incorrect username and/or password.'); // return cb(err, user, info)
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) { // for storing in session storage (and cookie content)
  cb(null, { id: user.id, email: user.email, name: user.name });
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
  secret: "es un secreto",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

app.post('/api/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next); // IIFE (Immediately Invoked Function Expression)
});

app.delete('/api/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) return res.status(200).json(req.user);
  return res.status(401).json({ error: 'Not authenticated' });
});

app.get('/api/riddles/users/current/others', isLoggedIn, async (req, res) => {
  try {
    let riddles = await riddleDAO.getAllRiddlesExceptMine(req.user.id);
    riddles.map((riddle) => {
      return new Riddle(riddle.id, riddle.state, riddle.question, riddle.difficulty, riddle.duration,
        riddle.endtime, riddle.hint1, riddle.hint2, riddles.answer, riddles.user, riddles.winnerid, riddles.winnername);
    });
    return res.status(200).json(riddles);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/riddles/users/current/mine', isLoggedIn, async (req, res) => {
  try {
    let riddles = await riddleDAO.getAllMyRiddles(req.user.id);
    riddles.map((riddle) => {
      return new Riddle(riddle.id, riddle.state, riddle.question, riddle.difficulty, riddle.duration,
        riddle.endtime, riddle.hint1, riddle.hint2, riddles.answer, riddles.user, riddles.winnerid, riddles.winnername);
    });
    return res.status(200).json(riddles);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/riddles', async (req, res) => {
  try {
    let riddles = await riddleDAO.getAllRiddles();
    riddles.map((riddle) => {
      return new Riddle(riddle.id, riddle.state, riddle.question, riddle.difficulty, riddle.duration,
        riddle.endtime, riddle.hint1, riddle.hint2, riddles.answer, riddles.user, riddles.winnerid, riddles.winnername);
    });
    return res.status(200).json(riddles);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/riddles/open/started', async (req, res) => {
  try {
    let riddles = await riddleDAO.getOpenAndStartedRiddles();
    riddles.map(r => {return ({riddleid: r.id, endtime: r.endtime})});
    return res.status(200).json(riddles);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/riddles/:id/replies', isLoggedIn, async (req, res) => {
  try {
    let replies = await replyDAO.getRepliesByRiddleID(req.params.id);
    replies.map((reply) => new Reply(reply.id, reply.riddleid, reply.userid, reply.reply));
    return res.status(200).json(replies);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/replies/current', isLoggedIn, async (req, res) => {
  try {
    let riddleIDs = await replyDAO.getAttemptedRiddleIDsByUserID(req.user.id);
    return res.status(200).json(riddleIDs);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/top3', async (req, res) => {
  try {
    let top3List = await userDAO.getTop3List();
    const top3ListUsers = top3List.map((user) => new User(user.id, user.name, user.email, user.score));
    return res.status(200).json(top3ListUsers);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/users/current/score', isLoggedIn, async (req, res) => {
  try {
    const score = await userDAO.getUserScoreByID(req.user.id);
    return res.status(200).json(score);
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/riddles',
  [
    isLoggedIn,
    check('question').exists().withMessage('Missing question'),
    check('question').isString().withMessage('Question is not as string'),
    check('difficulty').isString().withMessage('Difficulty is not a string'),
    check('duration').exists().withMessage('Missing Duration'),
    check('hint1').exists().withMessage('Missing hint 1'),
    check('hint1').isString().withMessage('Hint 1 is not a string'),
    check('hint2').exists().withMessage('Missing hint 2'),
    check('hint2').isString().withMessage('Hint 2 is not a string'),
    check('answer').exists().withMessage('Missing answer'),
    check('answer').isString().withMessage('Answer is not a string')
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const lastID = await riddleDAO.addRiddle(req.body, req.user.id); // gather from session
      return res.status(201).json({ lastID: lastID.id });
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' });
    }
  });

app.post('/api/riddles/:id/reply',
  [
    isLoggedIn,
    check('riddleID').exists().withMessage('Missing riddleID'),
    check('riddleID').isInt().withMessage('riddleID is not an int'),
    check('reply').exists().withMessage('Missing reply'),
    check('reply').isString().withMessage('reply is not a string'),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    try {
      const lastID = await replyDAO.addReply(req.body, req.user.id);
      return res.status(201).json({ lastID: lastID.id });
    }
    catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' });
    }
  });

app.put('/api/users/current/score', isLoggedIn, async (req, res) => {
  try {
    await userDAO.updateScore(req.user.id, req.body.newScore);
    return res.status(204).json({ message: 'OK' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/riddles/:id/endtime', isLoggedIn, async (req, res) => {
  try {
    await riddleDAO.setEndTime(req.params.id, req.body.endTime);
    return res.status(204).json({ message: 'OK' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/riddles/:id/state', async (req, res) => {
  try {
    await riddleDAO.closeRiddle(req.params.id);
    return res.status(204).json({ message: 'OK' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

app.put('/api/riddles/:id/winner', isLoggedIn, async (req, res) => {
  try {
    await riddleDAO.setWinner(req.params.id, req.user);
    return res.status(204).json({ message: 'OK' });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'DB error' });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});