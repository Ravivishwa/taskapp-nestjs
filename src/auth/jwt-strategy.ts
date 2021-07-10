import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "jsonwebtoken";
import { Strategy,ExtractJwt } from "passport-jwt"
import { User } from "./user.entity";
import { UserRepository } from "./user.respository";
import * as config from "config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
	){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
		})
	}

	async validate(payload: JwtPayload): Promise<User>{
		const { username } = payload
		const user =  await this.userRepository.findOne({ username 	})
		
		if(!user){
			throw new UnauthorizedException('User Not found')
		}

		return user;
	}
}