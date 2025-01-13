import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryColumn()
    username: string;

    @Column({
        nullable: true
    })
    firstName: string

    @Column({
        nullable: true
    })
    lastName: string

    @Column({
        nullable: true
    })
    age: number

    @Column()
    password: string;

}
