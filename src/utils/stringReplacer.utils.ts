export const replaceValues = (
  text: string,
  values: { template: string; value: string }[],
) => {
  let textWithValues = text;
  values.forEach(({ template, value }) => {
    textWithValues = textWithValues.replaceAll(template, value);
  });

  return textWithValues;
};

export const getOrderIntervalName = (orderId: number) => `order#${orderId}`;
