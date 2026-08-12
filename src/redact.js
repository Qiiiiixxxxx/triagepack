import os from 'node:os';

const SECRET_PATTERNS = [
  [/(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)[\s\S]*?(-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/g, '$1\n[REDACTED]\n$2'],
  [/\b(gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, '[REDACTED_GITHUB_TOKEN]'],
  [/\b(sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b/g, '[REDACTED_API_KEY]'],
  [/\b(AKIA[0-9A-Z]{16})\b/g, '[REDACTED_AWS_KEY]'],
  [/\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g, '[REDACTED_SLACK_TOKEN]'],
  [/((?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|pwd)\s*[=:]\s*)["']?[^\s,"']{6,}["']?/gi, '$1[REDACTED]'],
  [/(Authorization\s*:\s*(?:Bearer|Basic)\s+)[A-Za-z0-9._~+\/-]+=*/gi, '$1[REDACTED]'],
  [/(https?:\/\/[^\s/:]+:)[^@\s/]+(@)/gi, '$1[REDACTED]$2'],
  [/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[REDACTED_JWT]'],
  [/\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^\s]+/gi, '[REDACTED_CONNECTION_URL]']
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function redact(input) {
  let result = String(input ?? '');
  for (const [pattern, replacement] of SECRET_PATTERNS) result = result.replace(pattern, replacement);
  const home = os.homedir();
  if (home && home.length > 3) result = result.replace(new RegExp(escapeRegExp(home), 'gi'), '[HOME]');
  result = result
    .replace(/\b[A-Z]:\\Users\\[^\\\s]+/gi, '[HOME]')
    .replace(/\/(?:Users|home)\/[^/\s]+/g, '[HOME]');
  return result;
}

export function redactObject(value) {
  if (typeof value === 'string') return redact(value);
  if (Array.isArray(value)) return value.map(redactObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactObject(item)]));
  }
  return value;
}

export const looksSensitive = (input) => SECRET_PATTERNS.some(([pattern]) => {
  pattern.lastIndex = 0;
  return pattern.test(String(input));
});
