import { ISO_TIME_SECOND_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * ISO time second validation type.
 */
export type IsoTimeSecondValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'iso_time_second';
    /**
     * The ISO time second regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a validation function that validates a time with seconds.
 *
 * Format: hh:mm:ss
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function isoTimeSecond<TInput extends string>(
  message: ErrorMessage = 'Invalid time second'
): IsoTimeSecondValidation<TInput> {
  return {
    type: 'iso_time_second',
    async: false,
    message,
    requirement: ISO_TIME_SECOND_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
