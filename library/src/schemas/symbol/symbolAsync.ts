import type { BaseSchemaAsync, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Symbol schema async type.
 */
export type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<
  symbol,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'symbol';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates an async symbol schema.
 *
 * @param message The error message.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(
  message: ErrorMessage = 'Invalid type'
): SymbolSchemaAsync {
  return {
    type: 'symbol',
    async: true,
    message,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'symbol') {
        return getSchemaIssues(info, 'type', 'symbol', this.message, input);
      }

      // Return input as output
      return getOutput(input);
    },
  };
}
