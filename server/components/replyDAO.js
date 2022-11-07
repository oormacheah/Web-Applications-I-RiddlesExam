class ReplyDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Table management methods
    async newTableReplies() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS replies(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
                riddleid INTEGER NOT NULL, userid INTEGER NOT NULL,\
                reply TEXT NOT NULL, FOREIGN KEY(riddleid) REFERENCES riddles(id),\
                FOREIGN KEY(userid) REFERENCES users(id))"
        );
    }
    async dropTableReplies() {
        await this.dbHandler.run("DROP TABLE IF EXISTS replies");
    }

    // GET
    async getRepliesByRiddleID(riddleID) {
        return await this.dbHandler.all("SELECT * FROM replies WHERE riddleid=?", [riddleID]);
    }
    async getAttemptedRiddleIDsByUserID(userID) {
        return await this.dbHandler.all("SELECT riddleid FROM replies WHERE userid=?", [userID]);
    }

    // POST
    async addReply(reply, userID) {
        return await this.dbHandler.run("INSERT INTO replies(riddleid, userid, reply) VALUES (?, ?, ?)",
            [reply.riddleID, userID, reply.reply]
        );
    }
}

module.exports = ReplyDAO;