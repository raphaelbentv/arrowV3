import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CohortesService } from './cohortes.service';
import { CohortesController } from './cohortes.controller';
import { Cohorte, CohorteSchema } from './cohortes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cohorte.name, schema: CohorteSchema }]),
  ],
  controllers: [CohortesController],
  providers: [CohortesService],
  exports: [CohortesService],
})
export class CohortesModule {}