import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { v4 as uuid } from 'uuid';
import { CreatetaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(TaskRepository)
		private taskRepository: TaskRepository,
	){}

	async getTasks(filterDto: GetTasksFilterDto,user: User) {
		return this.taskRepository.getTasks(filterDto, user);
	}

	async getTaskById(id: number, user: User): Promise<Task> {
		const result = await this.taskRepository.findOne({where:{id,userId:user.id}});
		if(!result){
			throw new NotFoundException(`Task with id: ${id} not found`);
		}
		return result;
	}

	async createTask(
		createtaskDto: CreatetaskDto,
		user: User
		): Promise<Task> {
		return this.taskRepository.createTask(createtaskDto, user);
	}

	async deleteTask(id: number, user: User): Promise<void> {
		const result = await this.taskRepository.delete({id, userId: user.id});
		if(result.affected === 0){
			throw new NotFoundException(`Task with id: ${id} not found`);
		}
	}

	async updateTaskStatus(id :number,status:TaskStatus,user: User): Promise<Task> {
			const task = await this.getTaskById(id, user);
			task.status = status;
			await task.save();
			return task;
	}

}
