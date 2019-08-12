import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Membership } from "./membership";
import {Grade} from "./grade";

@Entity()
export class User {

    @PrimaryColumn()
    username: string;

    @Column()
    email: string;

    @Column({ default: "" })
    fname: string;

    @Column({ default: "" })
    lname: string;

    @Column()
    hash: string;

    @OneToMany(() => Membership, membership => membership.user, { cascade: true })
    memberships: Membership[];

    @OneToMany(() => Grade, grade => grade.user, { cascade: true })
    grades: Grade[];

}