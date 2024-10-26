import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SongArtists } from './song-artists.entity';
import { SongRequest } from './song-request.entity';

@Entity('song')
export class Song {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('varchar', { length: 255 })
    title: string;

    @Column('varchar', { length: 255 })
    image: string;

    @OneToMany(() => SongArtists, (artistSong) => artistSong.song)
    artistSongs: SongArtists[];

    @OneToMany(() => SongRequest, (songRequest) => songRequest.song)
    songRequests: SongRequest[];
}
