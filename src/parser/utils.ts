import HTMLElement from 'node-html-parser/dist/nodes/html';
import { GrabConfigItem } from 'parser/parser.types';

export const getGrabbedValues = (
  node: HTMLElement,
  grabConfig: GrabConfigItem[],
) =>
  grabConfig.reduce((acc, rule) => {
    acc[rule.label] = node.querySelector(rule.selector)?.textContent || '';

    return acc;
  }, {});
