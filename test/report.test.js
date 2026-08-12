import test from 'node:test';
import assert from 'node:assert/strict';
import { collectReport, renderReport } from '../src/report.js';

test('collects a command and renders markdown', async () => {
  const config = {
    project: 'fixture',
    commands: [{ name: 'Runtime', command: process.execPath, args: ['--version'], timeoutMs: 2000 }]
  };
  const report = await collectReport(config, { answers: { steps: 'Run it' } });
  assert.equal(report.diagnostics[0].status, 'ok');
  assert.match(renderReport(report), /# fixture diagnostic report/);
  assert.match(renderReport(report), /Run it/);
});

test('blocks shell commands even if called programmatically', async () => {
  const report = await collectReport({ project: 'fixture', commands: [{ name: 'Nope', command: 'bash', args: ['-c', 'echo unsafe'] }] });
  assert.equal(report.diagnostics[0].status, 'blocked');
});
