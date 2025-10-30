import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceStatus } from './attendance.schema';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard';
import { CreateAttendanceSessionDto, MarkAttendanceDto } from './dto/create-attendance.dto';

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

  // ----- New session-based endpoints -----
  @Post('session')
  async createSession(@Body() dto: CreateAttendanceSessionDto) {
    return await this.attendanceService.createSession(dto);
  }

  @Put('session/:id/mark')
  async markAttendance(@Param('id') sessionId: string, @Body() data: MarkAttendanceDto) {
    return await this.attendanceService.markAttendance(sessionId, data);
  }

  @Get('today')
  async getTodaySessions() {
    return await this.attendanceService.getTodaySessions();
  }

  @Get('student/:id/stats')
  async getStudentStats(@Param('id') studentId: string) {
    return await this.attendanceService.getStudentStats(studentId);
  }
}


