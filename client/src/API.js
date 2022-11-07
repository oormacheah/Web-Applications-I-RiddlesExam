import dayjs from 'dayjs';
import Riddle from './Riddle';
import Reply from './Reply';
import User from './User';

const expressServerURL = 'http://localhost:3001';

const logIn = async (credentials) => {
    const response = await fetch(`${expressServerURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(`${expressServerURL}/api/sessions/current`, {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;
    }
};

const logOut = async () => {
    const response = await fetch(`${expressServerURL}/api/logout`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) return null;
}

const getAllRiddles = async () => {
    const response = await fetch(`${expressServerURL}/api/riddles`, {
        method: 'GET'
    });
    const riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => new Riddle(r.id, r.state, r.question, r.difficulty, r.duration, r.endtime,
            r.hint1, r.hint2, r.answer, r.user, r.winnerid, r.winnername));
    }
    else throw riddlesJSON;
}

const getActiveRiddles = async () => {
    const response = await fetch(`${expressServerURL}/api/riddles/open/started`, {
        method: 'GET'
    });
    let riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => {
            return ({id: r.id, endtime: dayjs(r.endtime)});
        });
    }
    else throw riddlesJSON;
};

const getOthersRiddles = async () => {
    const response = await fetch(`${expressServerURL}/api/riddles/users/current/others`, {
        method: 'GET',
        credentials: 'include'
    });
    const riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => {
            return new Riddle(r.id, r.state, r.question, r.difficulty, r.duration, r.endtime,
            r.hint1, r.hint2, r.answer, r.user, r.winnerid, r.winnername)
        });
    }
    else throw riddlesJSON;
}

const getMyRiddles = async () => {
    const response = await fetch(`${expressServerURL}/api/riddles/users/current/mine`, {
        method: 'GET',
        credentials: 'include'
    });
    const riddlesJSON = await response.json();
    if (response.ok) {
        return riddlesJSON.map(r => new Riddle(r.id, r.state, r.question, r.difficulty, r.duration, r.endtime,
            r.hint1, r.hint2, r.answer, r.user, r.winnerid, r.winnername));
    }
    else throw riddlesJSON;
}

const getRepliesByRiddleID = async (riddleID) => {
    const response = await fetch(`${expressServerURL}/api/riddles/${riddleID}/replies`, {
        method: 'GET',
        credentials: 'include'
    });
    const repliesJSON = await response.json();
    if (response.ok) {
        return repliesJSON.map(rep => new Reply(rep.id, rep.riddleid, rep.userid, rep.reply));
    }
    else throw repliesJSON;
}

const getAttemptedRiddleIDs = async () => {
    const response = await fetch(`${expressServerURL}/api/replies/current`, {
        method: 'GET',
        credentials: 'include'
    });
    const attemptedRiddleIDs = await response.json();
    if (response.ok) {
        return attemptedRiddleIDs.map(el => el.riddleid);
    }
    else throw attemptedRiddleIDs;
}

const getTop3List = async () => {
    const response = await fetch(`${expressServerURL}/api/top3`, {
        method: 'GET'
    });
    const usersJSON = await response.json();
    if (response.ok) {
        return usersJSON.map(user => new User(user.id, user.name, user.email, user.score));
    }
    else throw usersJSON;
}

const getCurrentUserScore = async () => {
    const response = await fetch(`${expressServerURL}/api/users/current/score`, {
        method: 'GET',
        credentials: 'include'
    });
    const scoreJSON = await response.json();
    if (response.ok) {
        return scoreJSON.score;
    }
    else throw scoreJSON;
}

const addRiddle = async (riddle) => {
    const response = await fetch(`${expressServerURL}/api/riddles`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({question: riddle.question, difficulty: riddle.difficulty, 
            duration: riddle.duration, hint1: riddle.hint1, hint2: riddle.hint2, answer: riddle.answer})
    });
    if (response.ok) {
        return response.body.lastID;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const addReply = async (reply) => {
    const response = await fetch(`${expressServerURL}/api/riddles/${reply.riddleID}/reply`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({riddleID: reply.riddleID, reply: reply.reply})
    });
    if (response.ok) {
        return response.body.lastID;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const updateUserScore = async (newScore) => {
    const response = await fetch(`${expressServerURL}/api/users/current/score`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({newScore: newScore})
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const setEndTime = async (riddleID, dateTime) => {
    const dateTimeString = dayjs(dateTime).format('YYYY-MM-DD hh:mm:ss');
    const response = await fetch(`${expressServerURL}/api/riddles/${riddleID}/endtime`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ endTime: dateTimeString })
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const closeRiddle = async (riddleID) => {
    const response = await fetch(`${expressServerURL}/api/riddles/${riddleID}/state`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const setWinner = async (riddleID) => {
    const response = await fetch(`${expressServerURL}/api/riddles/${riddleID}/winner`, {
        method: 'PUT',
        headers: {'Content-Type': 'application-json'},
        credentials: 'include'
    });
    if (response.ok) {
        return null;
    }
    else {
        const errMessage = await response.json();
        throw errMessage;
    }
}

const API = {
    logIn, getUserInfo, logOut, getAllRiddles, getOthersRiddles, getMyRiddles, getRepliesByRiddleID, 
    getCurrentUserScore, getActiveRiddles,
    getAttemptedRiddleIDs, getTop3List, addRiddle, addReply, updateUserScore, setEndTime, closeRiddle, setWinner
};
export default API;