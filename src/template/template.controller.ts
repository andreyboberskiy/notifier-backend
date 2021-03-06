import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserId } from 'auth/decorators';
import { CheckDataResponse } from 'parser/parser.types';

import { CreateTemplateDto } from 'template/dto/create-template.dto';
import { GetTemplatesDto } from 'template/dto/get-templates.dto';
import { Template } from 'template/entity/template.entity';
import { TemplateService } from 'template/template.service';

@ApiTags('template')
@ApiBearerAuth()
@Controller('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUserId() userId,
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<{
    template: Template;
    checkData: CheckDataResponse;
  }> {
    return this.templateService.create({ ...createTemplateDto, userId });
  }

  @Get('/submit/:id')
  @HttpCode(HttpStatus.OK)
  submit(@Param() params, @GetUserId() userId: number): Promise<Template> {
    return this.templateService.submit(parseInt(params.id), userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getTemplates(@Query() getTemplatesDto: GetTemplatesDto) {
    return this.templateService.getTemplates(getTemplatesDto);
  }
}
