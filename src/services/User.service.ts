import { Prisma } from '@prisma/client';
import { userRepository } from '../repositories';

export class UserService {
  constructor(private readonly userDataSource = userRepository) {}

  async createOne(data: Prisma.UserUncheckedCreateInput) {
    return this.userDataSource.createOne(data);
  }

  async updateOne(
    query: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUncheckedUpdateInput
  ) {
    return this.userDataSource.updateOne(query, data);
  }

  async findUserByUUID(uuid: string) {
    return this.userDataSource.findOne({ uuid });
  }

  async findUserByEmail(email: string) {
    return this.userDataSource.findOne({ email });
  }

  async initializeUserWithProjectAndTasks(
    userData: Prisma.UserUncheckedCreateInput,
    projectData: Omit<Prisma.ProjectUncheckedCreateInput, 'userUuid'>,
    taskData: Omit<Prisma.TaskUncheckedCreateInput, 'projectUuid' | 'userUuid'>
  ) {
    return this.userDataSource.initializeUserWithProjectAndTasks(
      userData,
      projectData,
      taskData
    );
  }
}

export const userService = new UserService();
