import { CheckIntervalUnitsEnum } from 'order/types/checkIntervalUnitsEnum';

const timeMultiplierByUnit = {
  [CheckIntervalUnitsEnum.s]: 1,
  [CheckIntervalUnitsEnum.m]: 60,
  [CheckIntervalUnitsEnum.h]: 3600,
  [CheckIntervalUnitsEnum.d]: 86400,
  [CheckIntervalUnitsEnum.M]: 86400 * 30,
};

export const convertTimeValuesToSeconds = (
  time: number,
  unit: CheckIntervalUnitsEnum,
) => {
  const timeMultiplier = timeMultiplierByUnit[unit];

  return time * timeMultiplier;
};
