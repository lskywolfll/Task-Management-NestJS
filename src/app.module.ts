import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.18.0.2',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
