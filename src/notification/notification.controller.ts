import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {}
