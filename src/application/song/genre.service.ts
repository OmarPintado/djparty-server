import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from '../../domain/entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genres)
        private readonly genreRepository: Repository<Genres>,
    ) {}

    // List genres
    async findAll(
        page: number,
        limit: number,
    ): Promise<{ data: Genres[]; total: number }> {
        const [data, total] = await this.genreRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }

    // Search genres
    async findByName(
        name: string,
        page: number,
        limit: number,
    ): Promise<{ data: Genres[]; total: number }> {
        const [data, total] = await this.genreRepository.findAndCount({
            where: { genre: Like(`%${name}%`) },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
}
