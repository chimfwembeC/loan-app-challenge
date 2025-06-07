import { Loan } from 'src/loan/loan.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  nationalId: string;

  @Column({ unique: true })
  phoneNumber: string;

  @OneToMany(() => Loan, (loan) => loan.client)
  loans: Loan[];

  @ManyToOne(() => User, (user) => user.clients, { eager: false })
  user: User;
}
