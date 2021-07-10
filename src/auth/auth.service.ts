import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.respository';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository)
		private userRespository: UserRepository,
		private jwtService: JwtService
	){}

	async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>  {
		this.userRespository.signUp(authCredentialsDto);
	}

	async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
		const username  = await this.userRespository.validatePassword(authCredentialsDto);
		if(!username){
			throw new UnauthorizedException('Invalid credentials');
		}		
	
		const payload: JwtPayload = { username };
		const accessToken = await this.jwtService.sign(payload);
		return { accessToken }
		}
}
