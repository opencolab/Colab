import { Entity, Column, ManyToOne } from "typeorm";
import { Session } from "./session";
import { User } from "./user";

export enum Role {
    OWNER = "owner",
    MOD = "mod",
    GHOST = "ghost",
    PENDING = "pending"
}

@Entity()
export class Membership {


    @ManyToOne(() => Session, session => session.memberships, { primary: true })
    session: Session;

    @ManyToOne(() => User, user => user.memberships, { primary: true })
    user: User;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.GHOST
    })
    role: Role;

}