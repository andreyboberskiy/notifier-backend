import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import HTMLElement from 'node-html-parser/dist/nodes/html';

@Injectable()
export class ParserService {
  async getDOM(url: string): Promise<HTMLElement> {
    try {
      const { data } = await axios.get(url);
      return parse(data);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Cant parse this url');
    }
  }

  async getDataBySingleSelector(siteUrl: string, selector: string) {
    const dom = await this.getDOM(siteUrl);

    const result = dom.querySelector(selector)?.textContent;

    if (result) {
      return result.trim();
    } else {
      throw new BadRequestException('Cant find data by this selector');
    }
  }
}
