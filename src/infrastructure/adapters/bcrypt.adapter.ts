import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter {
    async hashPassword(
        password: string,
        saltOrRounds: number | string = 10,
    ): Promise<string> {
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
