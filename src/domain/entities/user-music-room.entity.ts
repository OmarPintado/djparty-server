import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MusicRoom } from './music-room.entity';

@Entity('user_music_room')
@Index(['music_room_id', 'user_id'], { unique: true })
export class UserMusicRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: false })
    user_id: string;

    @Column('uuid', { nullable: false })
    music_room_id: string;

    @Column('boolean', { default: false })
    is_banned: boolean;

    @ManyToOne(() => User, (user) => user.userMusicRooms)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => MusicRoom, (room) => room.userMusicRooms)
    @JoinColumn({ name: 'music_room_id' })
    room: MusicRoom;
}
