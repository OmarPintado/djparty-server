import {
    Column,
    Entity,
    Index,
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
    user: User;

    @ManyToOne(() => MusicRoom, (room) => room.userMusicRooms)
    room: MusicRoom;
}
