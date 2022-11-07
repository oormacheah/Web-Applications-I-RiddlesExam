class UserDAO {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }

    // Table management methods
    async newTableUsers() {
        await this.dbHandler.run(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\
                email TEXT NOT NULL, name TEXT, score INTEGER DEFAULT 0, hash TEXT NOT NULL, salt TEXT NOT NULL)"
        );
    }
    async dropTableUsers() {
        await this.dbHandler.run("DROP TABLE IF EXISTS users");
    }

    // GET
    async getUserByEmail(email) {
        return await this.dbHandler.get("SELECT id, email, name, score FROM users WHERE email=?", [email]);
    }
    async getUserScoreByID(ID) {
        return await this.dbHandler.get("SELECT score FROM users WHERE id=?", [ID]);
    }
    async getUsers() {
        return await this.dbHandler.all("SELECT id, email, name, score FROM users");
    }
    async getTop3List() {
        return await this.dbHandler.all("SELECT rnk, id, email, name, score FROM (SELECT dense_rank() OVER (ORDER BY score DESC) AS rnk, id, email, name, score FROM users) WHERE rnk <= 3 ORDER BY rnk");
    }

    // POST
    async addUser(user) {
        return await this.dbHandler.run("INSERT INTO users(email, name, hash, salt) VALUES(?, ?, ?, ?)", [user.email, user.name, user.hash, user.salt]);
    }

    // PUT
    async updateScore(userID, newScore) {
        return await this.dbHandler.run("UPDATE users SET score=? WHERE id=?", [newScore, userID]);
    }
}

module.exports = UserDAO;