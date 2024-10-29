import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { MusicRoom } from './music-room.entity';

@Entity('room_state')
export class RoomState {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('boolean', { nullable: false, default: false })
    is_open: boolean;

    @OneToOne(() => MusicRoom)
    @JoinColumn({ name: 'music_room_id' })
    music_room: MusicRoom;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
