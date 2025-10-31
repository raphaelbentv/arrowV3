import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { ModuleCours, ModuleCoursSchema } from './modules.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleCours.name, schema: ModuleCoursSchema },
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}

