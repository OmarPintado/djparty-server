import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserMusicRoom } from './user-music-room.entity';
import { RoomState } from './room-state.entity';

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

    @Column('boolean', { nullable: false, default: true })
    is_private: boolean;

    @Column('date', { nullable: false })
    start_date: Date;

    @Column('varchar', { nullable: true, default: null })
    password: string;

    @Column('text', { nullable: true, default: null })
    image_url: string;

    @ManyToOne(() => User, (user) => user.music_room)
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    user: User;

    @OneToMany(() => UserMusicRoom, (userMusicRoom) => userMusicRoom.room)
    userMusicRooms: UserMusicRoom[];

    @OneToOne(() => RoomState, (roomState) => roomState.music_room)
    roomState: RoomState;
}
