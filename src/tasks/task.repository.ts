import { InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreatetaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status-enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
	private logger = new Logger('TaskRepository');

	async getTasks(filterDto: GetTasksFilterDto, user: User):Promise<Task[]>{
		const { status, search } = filterDto;
		const query = this.createQueryBuilder('task');
		query.andWhere('task.user = :userId', { userId: user.id });
		if(status){
			query.andWhere('task.status = :status', { status });
		}

		if(search){
			query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search:`%${search}%` });
		}
		try {
			const tasks = await query.getMany();
			return tasks;
		} catch (error) {
			this.logger.error(`Falied to get user`)
			throw new InternalServerErrorException
		}
	}

	async createTask(
		createtaskDto: CreatetaskDto,
		user: User
		): Promise<Task> {
		const { title, description } = createtaskDto;
		const task =  new Task();
		task.title = title;
		task.description = description;
		task.status = TaskStatus.OPEN;
		task.user = user
		await task.save();
		return task;
	}
}