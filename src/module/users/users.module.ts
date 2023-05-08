import { Module } from '@nestjs/common';
import { usersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepo} from "./users.repo";
import { MongoDatabase } from "../../database/mongodb";

@Module({
  imports: [],
  controllers: [usersController],
  providers: [UsersService, UsersRepo, MongoDatabase],
})
export class UsersModule {}
