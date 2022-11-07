class RiddleDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Table management methods
    async newTableRiddles() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS riddles(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                 question TEXT, difficulty TEXT, state INTEGER DEFAULT 1, duration INTEGER, \
                 endtime DATETIME DEFAULT NULL, hint1 TEXT, hint2 TEXT, answer TEXT, \
                 user INTEGER, winnerid INTEGER DEFAULT NULL, winnername TEXT\
                 FOREIGN KEY(user) REFERENCES users(id), FOREIGN KEY(winnerid) REFERENCES users(id))"
        );
    }
    async dropTableRiddles() {
        await this.dbHandler.run("DROP TABLE IF EXISTS riddles");
    }

    // GET
    async getAllRiddles() {
        return await this.dbHandler.all("SELECT * FROM riddles");
    }
    async getAllRiddlesExceptMine(userID) {
        return await this.dbHandler.all("SELECT * FROM riddles WHERE user<>?", [userID]);
    }
    async getAllMyRiddles(userID) {
        return await this.dbHandler.all("SELECT * FROM riddles WHERE user=?", [userID]);
    }
    async getRiddleByID(ID) {
        return await this.dbHandler.get("SELECT * FROM riddles WHERE id=?", [ID]);
    }
    async getOpenAndStartedRiddles() {
        return await this.dbHandler.all("SELECT * FROM riddles WHERE state=1 AND endtime IS NOT NULL", []);
    }

    // POST
    async addRiddle(riddle, userID) {
        return await this.dbHandler.run(
            "INSERT INTO riddles(question, difficulty, duration, hint1, hint2, \
                answer, user) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [riddle.question, riddle.difficulty, riddle.duration, riddle.hint1, riddle.hint2,
                riddle.answer, userID]
        );
    }

    // PUT
    async setEndTime(riddleID, endTime) {
        return await this.dbHandler.run("UPDATE riddles SET endtime=? WHERE id=?", [endTime, riddleID]);
    }
    async closeRiddle(riddleID) {
        return await this.dbHandler.run("UPDATE riddles SET state=0 WHERE id=?", [riddleID]);
    }
    async setWinner(riddleID, user) {
        return await this.dbHandler.run("UPDATE riddles SET winnerid=?, winnername=? WHERE id=?", 
        [user.id, user.name, riddleID]);
    }
}

module.exports = RiddleDAO;