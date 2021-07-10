import { IsNotEmpty } from "class-validator";
export class CreatetaskDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	description: string;
}