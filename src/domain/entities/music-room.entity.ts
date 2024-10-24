import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('music-room')
export class MusicRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { default: null })
    description: string;

    @Column('boolean', { default: false })
    is_open: boolean;

    @ManyToOne(() => User, (user) => user.music_room)
    @JoinColumn({ name: 'created_by' })
    user: User;
}
