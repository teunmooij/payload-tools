/**
 * Payload openapi options
 */
export interface Options {
  /**
   * By default the access functions on all collections in the config are called to determine the access level of the operations.
   * @type {boolean} set to `true` to disable this behaviour
   * @type {string[]} or list the collections for which to opt out
   */
  disableAccessAnalysis?: boolean | string[];
}
