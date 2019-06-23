import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Membership } from "./membership";
import { Task } from "./task";
import { Grade } from "./grade";

export enum Privacy {
    PUBLIC = "public",
    HIDDEN = "hidden",
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

    @OneToMany(() => Membership, membership => membership.session, { cascade: true })
    memberships: Membership[];

    @OneToMany(() => Task, task => task.session, { cascade: true })
    tasks: Task[];

    @OneToMany(() => Grade, grade => grade.session, { cascade: true })
    grades: Grade[];

}