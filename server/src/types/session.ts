import { Suser } from "./suser";

export class Session {

    name: string;
    owner: Suser;
    users: Array<Suser>;

    constructor(name: string) {
        this.name = name;
        this.users = new Array<Suser>();
    }

    addUser(username: string, socketId) {
        let user = new Suser(username, socketId);
        this.users.push(user);
        return user;
    }

    removeUser(userID: string) {
        this.users = this.users.filter((user) => { return (user.socketId != userID); });
    }

    getUsernames() {
        let usernames = [];
        this.users.forEach((user) => { usernames.push(user.username); });
        return usernames;
    }

}