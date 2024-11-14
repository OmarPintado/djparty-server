import { IsUUID } from 'class-validator';

export class BanUserDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    roomId: string;
}
