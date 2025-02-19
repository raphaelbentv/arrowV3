import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { IntervenantsService } from './intervenants.service'
import { CreateIntervenantDto } from './dto/create-intervenant.dto'
import { UpdateIntervenantDto } from './dto/update-intervenant.dto'
import { JwtAuthGuard } from '../auth/gards/jwt-auth.guard'

@Controller('intervenants')
@UseGuards(JwtAuthGuard)
export class IntervenantsController {
  constructor(private readonly intervenantsService: IntervenantsService) {}

  @Post()
  create(@Body() createIntervenantDto: CreateIntervenantDto) {
    return this.intervenantsService.create(createIntervenantDto)
  }

  @Get()
  findAll() {
    return this.intervenantsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intervenantsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIntervenantDto: UpdateIntervenantDto
  ) {
    return this.intervenantsService.update(id, updateIntervenantDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intervenantsService.delete(id)
  }
}
