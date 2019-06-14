export class Sessioneer {

    username: string;
    socketId: string;

    constructor(username: string, socketId: string) {
        this.username = username;
        this.socketId = socketId;
    }

}