import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';
import type { NonOptional } from './nonOptional.ts';

/**
 * Non optional schema async type.
 */
export type NonOptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptional<Output<TWrapped>>
> = BaseSchemaAsync<NonOptional<Input<TWrapped>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'non_optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns An async non optional schema.
 */
export function nonOptionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped,
  message: ErrorMessage = 'Invalid type'
): NonOptionalSchemaAsync<TWrapped> {
  return {
    type: 'non_optional',
    async: true,
    wrapped,
    message,
    async _parse(input, info) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_optional',
          this.message,
          input
        );
      }

      // Return result of wrapped schema
      return this.wrapped._parse(input, info);
    },
  };
}
