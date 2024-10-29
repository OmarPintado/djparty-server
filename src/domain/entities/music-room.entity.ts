import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('music_room')
export class MusicRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { default: null })
    description: string;

    @Column('uuid', { nullable: false })
    created_by: string;

    @ManyToOne(() => User, (user) => user.music_room)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    user: User;
}
