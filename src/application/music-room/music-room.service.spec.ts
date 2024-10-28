import { Test, TestingModule } from '@nestjs/testing';
import { MusicRoomService } from './music-room.service';

describe('MusicRoomService', () => {
    let service: MusicRoomService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MusicRoomService],
        }).compile();

        service = module.get<MusicRoomService>(MusicRoomService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
