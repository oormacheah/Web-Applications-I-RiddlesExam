'use strict';

const dayjs = require('dayjs');

/**
 * Constructor function for new Riddle objects
 * @param {number} id ID of the Riddle (e.g., 1), given by the DB
 * @param {boolean} state State of the riddle ("true" for open, "false" for closed)
 * @param {string} question Riddle question (e.g., 'What is my name?')
 * @param {string} difficulty Difficulty given by the creator
 * @param {number} duration Duration originally given by the creator (in seconds)
 * @param {string} endTime Time when the riddle will expire (if no correct answer is given)
 * @param {string} hint1 Hint to be shown after 50% of the initial time
 * @param {string} hint2 After 75% of time has elapsed
 * @param {string} answer Riddle answer (e.g., Omar)
 * @param {number} user User ID (whom the riddle was created by)
 * @param {number} winnerID Winner user ID (whoever answered first)
 * @param {string} winnerName Winner name (for display purposes)
 */

function Riddle (id, state, question, difficulty, duration, endTime, hint1, hint2, answer, user, winnerID, winnerName) {
    this.id = id;
    this.state = state;
    this.question = question;
    this.difficulty = difficulty;
    this.duration = duration;
    this.endTime = (dayjs(endTime).isValid() ? dayjs(endTime) : undefined);
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.answer = answer;
    this.user = user;
    this.winnerID = winnerID;
    this.winnerName = winnerName;
}

module.exports = Riddle;