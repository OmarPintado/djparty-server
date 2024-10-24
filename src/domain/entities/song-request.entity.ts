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

@Entity()
@Index(['music_room_id', 'user_id', 'track_id'], { unique: true })
export class SongRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    track_id: string;

    @Column('varchar', { length: 100 })
    song_title: string;

    @Column('varchar', { length: 100 })
    artist: string;

    @Column('boolean', { default: false })
    is_accepted: boolean;

    @Column('uuid', { nullable: false })
    music_room_id: string;

    @Column('uuid', { nullable: true })
    user_id: string;

    @ManyToOne(() => MusicRoom, (musicRoom) => musicRoom.id)
    @JoinColumn({ name: 'music_room_id' })
    music_room: MusicRoom;

    @ManyToOne(() => User, (user) => user.music_room)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
