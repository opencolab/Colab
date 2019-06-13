import {Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    username: string;

    @Column()
    email: string;

    @Column()
    hash: string;

}