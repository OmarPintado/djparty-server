import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Song } from './song.entity';

@Entity('artist_song')
export class SongArtists {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    id_song: string;

    @Column('uuid')
    id_artist: string;

    @ManyToOne(() => Artist, (artist) => artist.artistSongs)
    @JoinColumn({ name: 'id_artist' })
    artist: Artist;

    @ManyToOne(() => Song, (song) => song.artistSongs)
    @JoinColumn({ name: 'id_song' })
    song: Song;
}
