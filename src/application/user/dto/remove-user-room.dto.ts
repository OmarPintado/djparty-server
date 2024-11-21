import { IsUUID } from 'class-validator';

export class RemoveUserRoomDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    roomId: string;
}
