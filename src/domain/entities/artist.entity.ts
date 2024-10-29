import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SongArtists } from './song-artists.entity';

@Entity('artists')
export class Artist {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar', { length: 150, unique: true })
    artist: string;

    @Column('varchar', { length: 100, unique: true })
    uri: string;

    @OneToMany(() => SongArtists, (songArtists) => songArtists.artist)
    artistSongs: SongArtists[];
}
