import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Membership } from "./membership";

export enum Privacy {
    PUBLIC = "public",
    HIDDEN = "editor",
    PRIVATE = "private"
}

@Entity()
export class Session {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    sname: string;

    @Column({
        type: "enum",
        enum: Privacy,
        default: Privacy.PUBLIC
    })
    privacy: Privacy;


    @Column({ default: "" })
    description: string;

    constructor(name: string) {
        this.sname = name;
    }

    @OneToMany(() => Membership, membership => membership.session, { cascade: true, onDelete: "CASCADE"})
    memberships: Membership[];

}