/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateIntervenantDto } from './create-intervenant.dto';

export class UpdateIntervenantDto extends PartialType(CreateIntervenantDto) {}