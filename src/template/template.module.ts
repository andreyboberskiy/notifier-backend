import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParserModule } from 'parser/parser.module';
import { Template } from 'template/entity/template.entity';
import { UserModule } from 'user/user.module';
import { UserService } from 'user/user.service';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), UserModule, ParserModule],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
