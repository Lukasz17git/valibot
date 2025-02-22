import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  Pipe,
} from '../../types/index.ts';
import {
  executePipe,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema type.
 */
export type SetSchema<
  TValue extends BaseSchema,
  TOutput = SetOutput<TValue>
> = BaseSchema<SetInput<TValue>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'set';
  /**
   * The set value schema.
   */
  value: TValue;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<SetOutput<TValue>> | undefined;
};

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
  value: TValue,
  pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
  value: TValue,
  message?: ErrorMessage,
  pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

export function set<TValue extends BaseSchema>(
  value: TValue,
  arg2?: Pipe<SetOutput<TValue>> | ErrorMessage,
  arg3?: Pipe<SetOutput<TValue>>
): SetSchema<TValue> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg2, arg3);

  // Create and return set schema
  return {
    type: 'set',
    async: false,
    value,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Set)) {
        return getSchemaIssues(info, 'type', 'set', this.message, input);
      }

      // Create key, output and issues
      let key = 0;
      let issues: Issues | undefined;
      const output: SetOutput<TValue> = new Set();

      // Parse each value by schema
      for (const inputValue of input) {
        // Get parse result of input value
        const result = this.value._parse(inputValue, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create set path item
          const pathItem: SetPathItem = {
            type: 'set',
            input,
            key,
            value: inputValue,
          };

          // Add modified result issues to issues
          for (const issue of result.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              issue.path = [pathItem];
            }
            issues?.push(issue);
          }
          if (!issues) {
            issues = result.issues;
          }

          // If necessary, abort early
          if (info?.abortEarly) {
            break;
          }

          // Otherwise, add item to set
        } else {
          output.add(result.output);
        }

        // Increment key
        key++;
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(output, this.pipe, info, 'set');
    },
  };
}
