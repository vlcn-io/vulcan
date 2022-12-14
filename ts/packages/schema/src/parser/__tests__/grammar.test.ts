import { contents, ast } from './testSchemaFile.js';
import { compileGrammar } from '../ohm/grammar.js';

const grammar = compileGrammar();

test('parsing a small schema', () => {
  const match = grammar.match(contents);
  expect(match.succeeded()).toBe(true);
});
