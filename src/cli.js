import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { collectReport, loadConfig, renderReport } from './report.js';
import { redact } from './redact.js';
import { validateConfig, validateReport } from './validate.js';

const VERSION = '0.1.0';

function usage() {
  return `TriagePack ${VERSION} — safe diagnostics for actionable bug reports

Usage:
  triagepack init [--force]
  triagepack collect [--config path] [--output path] [--yes] [--json]
  triagepack redact [file]
  triagepack check [report]
  triagepack doctor

Safety:
  Commands never run through a shell. collect shows the exact commands and asks
  for approval unless --yes is supplied. Common secrets and local paths are
  redacted before the report is written.
`;
}

function parseArgs(args) {
  const [command = 'help', ...rest] = args;
  const options = { positional: [] };
  for (let i = 0; i < rest.length; i += 1) {
    const value = rest[i];
    if (!value.startsWith('--')) options.positional.push(value);
    else if (['--yes', '--json', '--force'].includes(value)) options[value.slice(2)] = true;
    else {
      const next = rest[++i];
      if (!next || next.startsWith('--')) throw new Error(`${value} requires a value`);
      options[value.slice(2)] = next;
    }
  }
  return { command, options };
}

const starterConfig = {
  schemaVersion: 1,
  project: 'my-project',
  issueUrl: 'https://github.com/OWNER/REPO/issues/new',
  prompts: [
    { id: 'summary', label: 'What happened?', required: true },
    { id: 'steps', label: 'Steps to reproduce', required: true },
    { id: 'expected', label: 'What did you expect?', required: true }
  ],
  commands: [
    { name: 'Node.js', command: 'node', args: ['--version'], timeoutMs: 5000 },
    { name: 'Git', command: 'git', args: ['--version'], timeoutMs: 5000 }
  ]
};

async function confirmCommands(commands) {
  console.log('This trusted configuration requests the following commands:');
  for (const item of commands) console.log(`  • ${item.command} ${item.args.join(' ')}`);
  if (!stdin.isTTY) throw new Error('approval required; inspect the config, then use --yes');
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question('Continue? [y/N] ');
  rl.close();
  return /^y(es)?$/i.test(answer.trim());
}

async function answerPrompts(prompts, yes) {
  if (yes || prompts.length === 0 || !stdin.isTTY) return {};
  const rl = createInterface({ input: stdin, output: stdout });
  const answers = {};
  for (const prompt of prompts) {
    let answer = await rl.question(`${prompt.label}${prompt.required ? ' *' : ''}: `);
    while (prompt.required && !answer.trim()) answer = await rl.question('This answer is required: ');
    answers[prompt.id] = answer.trim();
  }
  rl.close();
  return answers;
}

async function init(options) {
  const path = resolve('triagepack.config.json');
  if (!options.force) {
    try {
      await access(path, constants.F_OK);
      throw new Error('triagepack.config.json already exists (use --force to replace it)');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await writeFile(path, `${JSON.stringify(starterConfig, null, 2)}\n`, 'utf8');
  console.log(`Created ${path}`);
}

async function collect(options) {
  const configPath = resolve(options.config || 'triagepack.config.json');
  const config = await loadConfig(configPath);
  const validation = validateConfig(config);
  if (!validation.ok) throw new Error(validation.errors.join('; '));
  if (!options.yes && !(await confirmCommands(config.commands))) {
    console.log('Cancelled. No commands were run.');
    return;
  }
  if (options.yes) console.warn('Non-interactive approval enabled. Configuration commands can execute code; only use --yes with a config you trust.');
  const answers = await answerPrompts(config.prompts, options.yes);
  const report = await collectReport(config, { cwd: process.cwd(), answers });
  const output = resolve(options.output || 'triagepack-report.md');
  if (options.json) {
    await writeFile(output.replace(/\.md$/i, '.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${output.replace(/\.md$/i, '.json')}`);
  } else {
    await writeFile(output, renderReport(report), 'utf8');
    console.log(`Wrote redacted report to ${output}`);
  }
}

async function redactCommand(options) {
  const file = options.positional[0];
  const input = file ? await readFile(resolve(file), 'utf8') : await new Promise((done) => {
    let data = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => { data += chunk; });
    stdin.on('end', () => done(data));
  });
  stdout.write(redact(input));
}

async function check(options) {
  const file = options.positional[0];
  if (file) {
    const result = validateReport(await readFile(resolve(file), 'utf8'));
    console.log(result.ok ? '✓ Report passed safety checks' : result.errors.map((e) => `✗ ${e}`).join('\n'));
    if (!result.ok) process.exitCode = 1;
    return;
  }
  const result = validateConfig(await loadConfig(resolve('triagepack.config.json')));
  console.log(result.ok ? '✓ Configuration is valid' : result.errors.map((e) => `✗ ${e}`).join('\n'));
  if (!result.ok) process.exitCode = 1;
}

async function doctor() {
  const details = [
    ['Node.js >= 20', Number(process.versions.node.split('.')[0]) >= 20, process.version],
    ['Interactive terminal', Boolean(stdin.isTTY), stdin.isTTY ? 'available' : 'not available'],
    ['Working directory', true, process.cwd()]
  ];
  for (const [name, ok, value] of details) console.log(`${ok ? '✓' : '○'} ${name}: ${value}`);
}

export async function main(args) {
  const { command, options } = parseArgs(args);
  if (['help', '--help', '-h'].includes(command)) return console.log(usage());
  if (['--version', '-v', 'version'].includes(command)) return console.log(VERSION);
  if (command === 'init') return init(options);
  if (command === 'collect') return collect(options);
  if (command === 'redact') return redactCommand(options);
  if (command === 'check') return check(options);
  if (command === 'doctor') return doctor();
  throw new Error(`unknown command: ${command}\n\n${usage()}`);
}
