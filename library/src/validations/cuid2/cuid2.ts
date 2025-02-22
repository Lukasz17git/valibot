import { CUID2_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Cuid2 validation type.
 */
export type Cuid2Validation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'cuid2';
  /**
   * The Cuid2 regex.
   */
  requirement: RegExp;
};

/**
 * Creates a validation function that validates a [Cuid2](https://github.com/paralleldrive/cuid2).
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function cuid2<TInput extends string>(
  message: ErrorMessage = 'Invalid Cuid2'
): Cuid2Validation<TInput> {
  return {
    type: 'cuid2',
    async: false,
    message,
    requirement: CUID2_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
