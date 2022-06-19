import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import HTMLElement from 'node-html-parser/dist/nodes/html';
import { CheckDataResponse, GrabConfigItem } from 'parser/parser.types';
import { getGrabbedValues } from 'parser/utils';
import { ParseTypeEnum } from 'template/types/parse-type-enums.type';

@Injectable()
export class ParserService {
  getCheckData({
    parseType,
    siteUrl,
    selector,
    excludedSelectors,
    grabConfig,
  }: {
    parseType: ParseTypeEnum;
    siteUrl: string;
    selector: string;
    excludedSelectors?: string[];
    grabConfig?: { label: string; selector: string }[];
  }): Promise<CheckDataResponse> {
    switch (parseType) {
      case ParseTypeEnum.list: {
        return this.getListValues({
          siteUrl,
          selector,
          excludedSelectors,
          grabConfig,
        });
      }
      case ParseTypeEnum.singleValue: {
        return this.getSingleValue(siteUrl, selector, grabConfig);
      }
      default: {
        return null;
      }
    }
  }

  async getDOM(url: string): Promise<HTMLElement> {
    try {
      const { data } = await axios.get(url);
      return parse(data);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Cant parse this url');
    }
  }

  private async getSingleValue(
    siteUrl: string,
    selector: string,
    grabConfig: GrabConfigItem[],
  ): Promise<{
    compareValue: string;
    grabbedValues: { [key: string]: string };
  }> {
    const dom = await this.getDOM(siteUrl);

    const result = dom.querySelector(selector)?.textContent;

    if (result) {
      return {
        compareValue: result.replace(/\s+/g, ' ').trim(),
        grabbedValues: getGrabbedValues(dom, grabConfig),
      };
    } else {
      throw new BadRequestException('Cant find data by this selector');
    }
  }
  private async getListValues({
    siteUrl,
    selector,
    excludedSelectors,
    grabConfig,
  }: {
    siteUrl: string;
    selector: string;
    excludedSelectors?: string[];
    grabConfig?: { label: string; selector: string }[];
  }) {
    try {
      const dom = await this.getDOM(siteUrl);

      const [firstSelector, ...restSelectors] = selector.split(' ');

      const restSelector = restSelectors.join(' ');

      const nodes = dom.querySelectorAll(firstSelector);
      const generalNodesWithoutExcluded = nodes.filter((i) => {
        return !(
          excludedSelectors &&
          excludedSelectors.some((es) => !!i.querySelector(es))
        );
      });

      let grabbedValues = [];

      if (grabConfig) {
        grabbedValues = generalNodesWithoutExcluded.map((gn) =>
          getGrabbedValues(gn, grabConfig),
        );
      }

      const nodesWithoutExcluded = generalNodesWithoutExcluded.map((n) =>
        n.querySelector(restSelector),
      );

      const withoutExcludedData = nodesWithoutExcluded.map((i, index) => {
        const res = { compareValue: i.textContent };
        if (grabConfig) {
          res['grabbedValues'] = grabbedValues[index];
        }
        return res;
      });

      const result = {
        allData: withoutExcludedData,
        compareValue: withoutExcludedData[0]?.compareValue,
        grabbedValues: grabbedValues[0],
      };

      if (grabConfig) {
        result['grabbedValues'] = grabbedValues[0];
      }

      if (withoutExcludedData?.length) {
        return result;
      }
      throw new Error('Cant find data by this selector');
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
