import { Test, TestingModule } from '@nestjs/testing';
import { MusicRoomController } from './music-room.controller';
import { MusicRoomService } from './music-room.service';

describe('MusicRoomController', () => {
    let controller: MusicRoomController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MusicRoomController],
            providers: [MusicRoomService],
        }).compile();

        controller = module.get<MusicRoomController>(MusicRoomController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
