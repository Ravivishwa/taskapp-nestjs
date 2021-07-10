import { 
	Body, 
	Controller, 
	Delete, 
	Get, 
	Logger, 
	Param, 
	ParseIntPipe, 
	Patch, 
	Post, 
	Query, 
	UseGuards, 
	UsePipes, 
	ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreatetaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	private logger = new Logger('TasksController');
	constructor(private tasksService: TasksService){}

	@Get()
	getTasks(@Query(ValidationPipe) filterDto:GetTasksFilterDto,@GetUser() user:User): Promise<Task[]> {	
			return this.tasksService.getTasks(filterDto,user);
	}

	@Get('/:id')
	getTaskById(@Param('id', ParseIntPipe) id:number, @GetUser() user:User): Promise<Task> {
		return this.tasksService.getTaskById(id,user);
	}

	@Post()
	@UsePipes(ValidationPipe)
	createTask(
		@Body() createtaskDto:CreatetaskDto,
		@GetUser() user:User
		): Promise<Task> {
			return this.tasksService.createTask(createtaskDto, user);
	}

	@Delete('/:id')
	deleteTask(@Param('id', ParseIntPipe) id:number,@GetUser() user:User): Promise<void> {
		return this.tasksService.deleteTask(id, user);
	}

	@Patch('/:id/status')
	updatetaskStatus(
		@Param('id', ParseIntPipe) id:number,
		@Body('status',TaskStatusValidationPipe) status:TaskStatus,
		@GetUser() user:User
	):Promise<Task>{
		return this.tasksService.updateTaskStatus(id,status,user);
	}
}
