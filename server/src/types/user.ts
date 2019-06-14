import {Entity, PrimaryColumn, Column } from "typeorm";

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

}