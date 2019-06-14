import { Peer } from "./peer";

export class Session {

    name: string;
    owner: Peer;
    peers: Array<Peer>;

    constructor(name: string) {
        this.name = name;
        this.peers = new Array<Peer>();
    }

    add(username: string, socketId: string) {
        let sessioneer = new Peer(username, socketId);
        this.peers.push(sessioneer);
        return sessioneer;
    }

    remove(socketId: string) {
        let peer: Peer = null;
        for(let i = 0; i < this.peers.length; ++i) {
            if(this.peers[i].socketId == socketId) { peer = this.peers[i]; break; }
        }

        if(peer != null) {
            this.peers = this.peers.splice(this.peers.indexOf(peer), 1);
        }
        return peer;
    }

}