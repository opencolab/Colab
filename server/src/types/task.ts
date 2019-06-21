import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from "typeorm";
import { Session } from "./session";
import {Grade} from "./grade";

@Entity()
export class Task {

    @ManyToOne(() => Session, session => session.tasks, { primary: true })
    session: Session;

    @Column({primary: true})
    id: number;

    @Column({ default: "" })
    name: string;

    @Column({ default: "" })
    description: string;

    @Column("simple-array")
    hints: string[];

    @Column()
    cases: number;

    @OneToMany(() => Grade, grade => grade.task, { cascade: true, onDelete: "CASCADE"})
    grades: Grade[];

}