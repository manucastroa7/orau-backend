import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async login(user: any) {
        const foundUser = await this.usersService.findByEmail(user.username);

        if (foundUser && foundUser.password === user.password) {
            return {
                user: { id: foundUser.id, username: foundUser.email, role: foundUser.role },
                token: 'fake-jwt-token-backend',
                isAuthenticated: true
            };
        }
        throw new UnauthorizedException('Credenciales incorrectas');
    }
}
