import { Sessioneer } from "./sessioneer";

export class Session {

    name: string;
    owner: Sessioneer;
    sesssioneers: Array<Sessioneer>;

    constructor(name: string) {
        this.name = name;
        this.sesssioneers = new Array<Sessioneer>();
    }

    add(username: string, socketId: string) {
        let sessioneer = new Sessioneer(username, socketId);
        this.sesssioneers.push(sessioneer);
        return sessioneer;
    }

    remove(socketId: string) {
        let sessioneer: Sessioneer = null;
        for(let i = 0; i < this.sesssioneers.length; ++i) {
            if(this.sesssioneers[i].socketId == socketId) { sessioneer = this.sesssioneers[i]; break; }
        }

        if(sessioneer != null) {
            this.sesssioneers = this.sesssioneers.splice(this.sesssioneers.indexOf(sessioneer), 1);
        }
        return sessioneer;
    }

}