import test from 'node:test';
import assert from 'node:assert/strict';
import { redact, redactObject } from '../src/redact.js';

test('redacts common API tokens', () => {
  const cases = [
    'token=ghp_abcdefghijklmnopqrstuvwxyz1234567890',
    'OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz123456',
    'Authorization: Bearer abc.def.abcdefghijklmnopqrstuvwxyz',
    'password=hunter2-secret'
  ];
  for (const value of cases) assert.match(redact(value), /REDACTED/);
});

test('redacts credentials embedded in URLs', () => {
  assert.equal(redact('https://alice:secret@example.com/path'), 'https://alice:[REDACTED]@example.com/path');
});

test('redacts connection URLs and JWTs', () => {
  assert.equal(redact('postgres://user:secret@localhost/app'), '[REDACTED_CONNECTION_URL]');
  assert.equal(redact('eyJabcdefghij.abcdefghijk.abcdefghijk'), '[REDACTED_JWT]');
});

test('redacts private key bodies', () => {
  const value = '-----BEGIN PRIVATE KEY-----\nvery-secret\n-----END PRIVATE KEY-----';
  const output = redact(value);
  assert.doesNotMatch(output, /very-secret/);
  assert.match(output, /BEGIN PRIVATE KEY/);
});

test('walks nested report values', () => {
  const value = redactObject({ output: ['api_key=super-secret-value'] });
  assert.equal(value.output[0], 'api_key=[REDACTED]');
});
