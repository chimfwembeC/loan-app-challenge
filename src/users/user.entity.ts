import { Client } from 'src/client/client.entity';
import { Loan } from 'src/loan/loan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];

  @OneToMany(() => Loan, (loan) => loan.client)
  loans: Loan[];
}
