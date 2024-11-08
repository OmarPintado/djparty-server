import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MusicRoom } from './music-room.entity';
import { UserMusicRoom } from './user-music-room.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    fullName: string;

    @Column('text', { unique: true })
    email: string;

    @Column('text', { select: false })
    password: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @Column('text', { nullable: true, default: null })
    url_profile: string;

    @OneToMany(() => MusicRoom, (musicRoom) => musicRoom.user)
    music_room: MusicRoom[];

    @OneToMany(() => UserMusicRoom, (userMusicRoom) => userMusicRoom.user)
    userMusicRooms: UserMusicRoom[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
