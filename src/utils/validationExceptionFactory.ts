import { BadRequestException } from '@nestjs/common';

const validationExceptionFactory = (errors) => {
  const transformedErrors = errors.reduce((accum, currError) => {
    accum[currError.property] = Object.values(currError.constraints).map(
      (e: string) => e.charAt(0).toUpperCase() + e.slice(1),
    );
    return accum;
  }, {});

  throw new BadRequestException({
    message: 'Validation error',
    errors: transformedErrors,
  });
};

export default validationExceptionFactory;
