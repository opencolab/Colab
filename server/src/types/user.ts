import {Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    username: string;

    @Column()
    email: string;

    @Column()
    fname: string;

    @Column()
    lname: string;

    @Column()
    hash: string;

}