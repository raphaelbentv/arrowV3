import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus } from './attendance.schema';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';

@Controller('attendance')
@UseGuards(DevAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async upsertOne(@Body() body: { etudiantId: string; sessionId: string; status: AttendanceStatus; commentaire?: string; saisiPar?: string }) {
    return await this.attendanceService.upsertOne(body);
  }

  @Patch(':id/justificatif/:docId')
  async attachJustificatif(@Param('id') id: string, @Param('docId') docId: string) {
    return await this.attendanceService.attachJustificatif(id, docId);
  }

  @Get('session/:sessionId')
  async listBySession(@Param('sessionId') sessionId: string) {
    return await this.attendanceService.listBySession(sessionId);
  }

  @Get('etudiant/:etudiantId')
  async listByEtudiant(@Param('etudiantId') etudiantId: string) {
    return await this.attendanceService.listByEtudiant(etudiantId);
  }
}


