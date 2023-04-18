import { GlobalAfterReadHook, CollectionAfterReadHook } from 'payload/types';

import { selectInternal } from './select';

export const collectionSelectHook: CollectionAfterReadHook = ({ doc, req }) => {
  const { select: fields } = req.query || {};
  if (typeof fields !== 'object') return doc;

  return selectInternal(fields, doc);
};

export const globalSelectHook: GlobalAfterReadHook = ({ doc, req }) => {
  const { select: fields } = req.query || {};
  if (typeof fields !== 'object') return doc;

  return selectInternal(fields, doc);
};
