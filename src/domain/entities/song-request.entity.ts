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
import { Song } from './song.entity';

@Entity('song_request')
@Index(['music_room_id', 'user_id', 'song_id'], { unique: true })
export class SongRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: false })
    song_id: string;

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

    @ManyToOne(() => Song, (song) => song.songRequests)
    @JoinColumn({ name: 'song_id' })
    song: Song;
}
