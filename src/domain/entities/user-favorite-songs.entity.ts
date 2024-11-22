import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity('user_favorite_songs')
export class UserFavoriteSongs {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.favoriteSongs, { eager: true })
    user: User;

    @ManyToOne(() => Song, (song) => song.favoriteUsers, { eager: true })
    song: Song;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;
}
