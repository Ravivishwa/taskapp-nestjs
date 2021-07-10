import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt"
import { AuthCredentialsDto } from "./auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

	async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void>{		
		const { username,password } = authcredentialsDto;			
		const user =  new User();
		user.username = username; 
		user.salt = await bcrypt.genSalt(); 
		user.password = await this.hashPassword(password, await bcrypt.genSalt());
		try {
			await user.save(); 
		} catch (error) {
			if(error.code === '23505') {
				 throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}		
	}

	async validatePassword(authcredentialsDto: AuthCredentialsDto): Promise<string>{
		const { username, password} = authcredentialsDto;
		const user = await this.findOne({ username });
		if(user && user.validatePassword(password)){
			return user.username
		}else {
			return null;
		}
	}

	private async hashPassword(password: string, salt: string): Promise<string>{
		return bcrypt.hash(password,salt);
	}
}