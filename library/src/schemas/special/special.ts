import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Special schema type.
 */
export type SpecialSchema<TInput, TOutput = TInput> = BaseSchema<
  TInput,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<TInput> | undefined;
};

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  message?: ErrorMessage,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

export function special<TInput>(
  check: (input: unknown) => boolean,
  arg2?: Pipe<TInput> | ErrorMessage,
  arg3?: Pipe<TInput>
): SpecialSchema<TInput> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'special',
    async: false,
    check,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!this.check(input)) {
        return getSchemaIssues(info, 'type', 'special', this.message, input);
      }

      // Execute pipe and return result
      return executePipe(input as TInput, this.pipe, info, 'special');
    },
  };
}
