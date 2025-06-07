import { Client } from 'src/client/client.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column()
  term: number;

  @Column('decimal')
  interestRate: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'active' | 'closed';

  @ManyToOne(() => Client, (client) => client.loans)
  client: Client;

  @ManyToOne(() => User, (user) => user.loans, { eager: false })
  createdBy: User;
}
