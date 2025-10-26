import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignStudentsDto {
  @ApiProperty({ type: [String], example: ['507f1f77bcf86cd799439011'] })
  @IsArray()
  @IsNotEmpty()
  etudiantIds: string[];
}