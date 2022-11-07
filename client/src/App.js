import './App.css';
import React from 'react';
import dayjs from 'dayjs';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { MainRoute, MyRiddleRoute, OthersRiddleRoute, LoginRoute, NewRiddleRoute } from './components/riddleRoutes';
import API from './API';

function App() {
  // const [activeRiddles, setActiveRiddles] = useState([]);
  const [replies, setReplies] = useState([]);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [user, setUser] = useState({id: 0});
  const [currentNameScore, setCurrentNameScore] = useState({});
  const [option, setOption] = useState('Riddles');
  const [riddles, setRiddles] = useState([]);
  const [top3, setTop3] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [message, setMessage] = useState('');

  const changeOption = (option) => setOption(option);

  useEffect(() => {
    const interval = setInterval(async () => {
      let activeRiddles;
      // polling every second for checking if timers expired and eventually closing them.
      setCurrentTime(dayjs());
      activeRiddles = await API.getActiveRiddles();
      for (let riddle of activeRiddles) {
        if (riddle.endtime.diff(dayjs().format('YYYY-MM-DD hh:mm:ss'), 'second') <= 0) {
          await API.closeRiddle(riddle.id);
          setRiddles(await API.getAllRiddles());
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDataFromServer = useCallback(async () => {
    if (option === 'Top 3') {
      let top3List = await API.getTop3List();
      setTop3(top3List);
    }
    else {
      let filteredRiddles;
      if (user.id) { // if logged in
        switch (option) {
          case 'Riddles':
            filteredRiddles = await API.getOthersRiddles();
            setAttempted(await API.getAttemptedRiddleIDs());
            break;
          case 'My Riddles':
            filteredRiddles = await API.getMyRiddles();
            break;
          default:
            filteredRiddles = undefined;
            break;
        }
      }
      else {
        filteredRiddles = await API.getAllRiddles(); // "No filtering (take all riddles)"
      }
      setRiddles(filteredRiddles);
    }
  }, [option, user.id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); // we have the user info here
        setUser(user);
        const currentScore = await API.getCurrentUserScore();
        setCurrentNameScore({ name: user.name, score: currentScore });

      }
      catch (err) {
        setUser({id: 0});
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    const getData = async () => {
      await getDataFromServer();
    }
    getData();
  }, [option, getDataFromServer, user.id, replies.length]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      const currentScore = await API.getCurrentUserScore();
      setCurrentNameScore({ name: user.name, score: currentScore });
      setUser(user);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    }
    catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setUser({id: 0});
    setCurrentNameScore({});
    setMessage('');
  };

  const addRiddle = async (newRiddle) => {
    setRiddles(oldRiddles => [...oldRiddles, newRiddle]); // update local state
    await API.addRiddle(newRiddle);
    await getDataFromServer();
  };

  const addReply = async (newReply) => {
    await API.addReply(newReply);
    if (newReply.correct) {
      await API.closeRiddle(newReply.riddleID);
      await API.setWinner(newReply.riddleID);
      let score = await API.getCurrentUserScore();
      score += newReply.points;
      setCurrentNameScore((prev) => {
        return { name: prev.name, score: score }
      });
      await API.updateUserScore(score);
    }
    setReplies(oldReplies => [...oldReplies,
      <tr key={0}>
        <td>{newReply.reply}</td>
      </tr>]
    );
    setAttempted(oldAttempted => [...oldAttempted, newReply.riddleID]);
  }

  const setEndTime = async (riddleID, endTime) => {
    await API.setEndTime(riddleID, endTime);
    await getDataFromServer();
  };

  const getReplies = async (riddleID) => {
    let replies = await API.getRepliesByRiddleID(riddleID);
    setReplies(replies.map(rep => {
      return (
        <tr key={rep.id}>
          <td>{rep.reply}</td>
        </tr>
      );
    }));
  };

  return (
    <Container className="App" fluid>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainRoute user={user} option={"Riddles"} setOption={changeOption} riddles={riddles}
            msg={message} setMessage={setMessage} logout={handleLogout} attempted={attempted}
            nameScore={currentNameScore} getReplies={getReplies} />} />
          <Route path='/top3' element={<MainRoute user={user} option={"Top 3"} setOption={changeOption}
            top3={top3} msg={message} setMessage={setMessage}
            nameScore={currentNameScore} logout={handleLogout} />} />
          <Route path='/myriddles' element={!user ? <Navigate replace to='/' /> :
            <MainRoute user={user} option={"My Riddles"} attempted={attempted}
              setOption={changeOption} nameScore={currentNameScore}
              msg={message} setMessage={setMessage} riddles={riddles}
              logout={handleLogout} getReplies={getReplies} />} />
          <Route path='/login' element={user.id ? <Navigate replace to='/' /> :
            <LoginRoute login={handleLogin} msg={message} setMessage={setMessage} />} />
          <Route path='/riddles/:riddleID' element={<OthersRiddleRoute riddles={riddles} addReply={addReply}
            msg={message} setMessage={setMessage} currentTime={currentTime} setEndTime={setEndTime}
            replies={replies} />} />
          <Route path='myriddles/:riddleID' element={<MyRiddleRoute riddles={riddles} replies={replies} msg={message}
            setMessage={setMessage} currentTime={currentTime}/>} />
          <Route path='/new' element={<NewRiddleRoute user={user} msg={message} setMessage={setMessage}
            addRiddle={addRiddle} />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;