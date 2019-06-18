import { Column, Entity, ManyToOne } from "typeorm";
import { Task } from "./task";
import { User } from "./user";
import { Session } from "./session";

@Entity()
export class Grade {

    @ManyToOne(() => Session, session => session.grades, { primary: true })
    session: Session;

    @ManyToOne(() => Task, task => task.grades, { primary: true })
    task: Task;

    @ManyToOne(() => User, user => user.grades, { primary: true })
    user: User;

    @Column()
    correct: number;

    @Column()
    wrong: number;

}