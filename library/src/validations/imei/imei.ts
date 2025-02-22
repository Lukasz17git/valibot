import { IMEI_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues, isLuhnAlgo } from '../../utils/index.ts';

/**
 * IMEI validation type.
 */
export type ImeiValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'imei';
  /**
   * The IMEI regex and luhn algorithm.
   */
  requirement: [RegExp, (input: string) => boolean];
};

/**
 * Creates a validation function that validates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity).
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function imei<TInput extends string>(
  message: ErrorMessage = 'Invalid IMEI'
): ImeiValidation<TInput> {
  return {
    type: 'imei',
    async: false,
    message,
    requirement: [IMEI_REGEX, isLuhnAlgo],
    _parse(input) {
      return !this.requirement[0].test(input) || !this.requirement[1](input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
