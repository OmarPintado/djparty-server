import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genres')
export class Genres {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100, unique: true })
    genre: string;
}
