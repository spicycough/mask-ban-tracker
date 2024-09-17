import {
  type Maybe,
  type TransformOptions,
  toCustom,
} from "@modular-forms/solid";

const DEFAULT_TRANSFORM_VALUE = "";
const REGEX_NOT_NUMBER = /\D/g;
const REGEX_PHONE_NUMBER = /(\d{0,3})(\d{0,3})(\d{0,4})/;

export function transformToPhoneNumber(options: TransformOptions) {
  return toCustom<string>(toPhoneNumber, options);
}

function toPhoneNumber(value: Maybe<string>) {
  if (!value) {
    return DEFAULT_TRANSFORM_VALUE;
  }

  const numbers = value.replace(REGEX_NOT_NUMBER, "");
  if (!numbers) {
    return DEFAULT_TRANSFORM_VALUE;
  }

  // Extract area, first 3 and last 4
  const [, area, first3, last4] = numbers.match(REGEX_PHONE_NUMBER) || [];

  if (first3.length < 1) {
    return `(${area})`;
  }
  if (last4.length < 1) {
    return `(${area}) ${first3}`;
  }

  return `(${area}) ${first3}-${last4}`;
}
