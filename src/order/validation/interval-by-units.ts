import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

const maxIntervalByUnit = {
  seconds: 60,
  minutes: 60,
  hours: 24,
  days: 28,
  month: 12,
};

@ValidatorConstraint({ name: 'customText', async: false })
export class IntervalByUnits implements ValidatorConstraintInterface {
  validate(interval: number, args: ValidationArguments) {
    console.log({ args });
    return interval < maxIntervalByUnit[args.object['checkIntervalUnit']]; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return `Max ${args.object['checkIntervalUnit']} is ${
      maxIntervalByUnit[args.object['checkIntervalUnit']]
    }`;
  }
}
