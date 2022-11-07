'use strict';

/**
 * Constructor function for new Reply objects
 * @param {number} id ID of the reply
 * @param {number} riddleID ID of the riddle whom this reply belongs to
 * @param {number} userID ID of the user that gave this reply
 * @param {string} reply Reply text
 */

function Reply (id, riddleID, userID, reply) {
    this.id = id;
    this.riddleID = riddleID;
    this.userID = userID;
    this.reply = reply;
}

module.exports = Reply;