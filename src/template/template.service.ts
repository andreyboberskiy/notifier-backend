import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import analytic from 'analytic';
import { GetTemplatesDto } from 'template/dto/get-templates.dto';
import { Like, Repository } from 'typeorm';

import { ParserService } from 'parser/parser.service';
import { CreateTemplateDto } from 'template/dto/create-template.dto';
import { Template } from 'template/entity/template.entity';
import { UserService } from 'user/user.service';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private parserService: ParserService,
    private userService: UserService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const {
      name,
      description,
      siteUrl,
      selector,
      userId,
      checkUrl,
      notifyPhrase,
      parseType,
    } = createTemplateDto;

    const checkData = await this.parserService.getDataBySingleSelector(
      checkUrl,
      selector,
    );

    const templatePayload: Partial<Template> = {
      name,
      description,
      siteUrl,
      selector,
      notifyPhrase,
      author: null,
      parseType,
    };

    if (userId) {
      const author = await this.userService.getUser(userId);
      if (author) {
        templatePayload.author = author;
      }
    }

    try {
      const template = this.templateRepository.create(templatePayload);
      await template.save();

      analytic.send('Template created', userId);

      return { template, checkData };
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException('Template with this name already exist');
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async submit(templateId: number, userId: number) {
    const template = await this.templateRepository.findOne({
      loadRelationIds: {
        relations: ['author'],
      },
      where: {
        id: templateId,
      },
    });

    if (!template)
      throw new NotFoundException('Template with this id doesnt exist');

    if (template.author !== userId)
      throw new ForbiddenException('Access denied');

    template.draft = false;
    analytic.send('Template submitted', userId);

    return template.save();
  }

  async getById(id: number): Promise<Template> {
    const template = await this.templateRepository.findOneBy({ id });
    if (!template)
      throw new NotFoundException('Template with this id not found');
    return template;
  }

  async getTemplates(payload: GetTemplatesDto) {
    const { authorId, name, offset, limit = 10, withAuthor = false } = payload;

    const relations = [];
    if (withAuthor) {
      relations.push('author');
    }
    const templates = await this.templateRepository.find({
      skip: offset,
      take: limit,
      where: {
        author: { id: authorId },
        name: name ? Like(`%${name}%`) : undefined,
      },
      relations,
    });

    return templates;
  }
}
