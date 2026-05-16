import type { CodeFiles, ValidationResult, ValidationRule } from "./types";

const normalize = (value: string, caseSensitive = false) =>
  caseSensitive
    ? value
    : value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

function parseTableAnswers(value: string): Record<string, Record<string, string>> {
  try {
    const parsed = JSON.parse(value);

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, Record<string, string>>;
    }
  } catch {
    return {};
  }

  return {};
}

function evaluateRule(
  rule: ValidationRule,
  files: CodeFiles,
  consoleLines: string[],
): boolean {
  if (rule.type === "contains") {
    return normalize(files[rule.field], rule.caseSensitive).includes(
      normalize(rule.value, rule.caseSensitive),
    );
  }

  if (rule.type === "notContains") {
    return !normalize(files[rule.field], rule.caseSensitive).includes(
      normalize(rule.value, rule.caseSensitive),
    );
  }

  if (rule.type === "regex") {
    try {
      return new RegExp(rule.pattern, rule.flags).test(files[rule.field]);
    } catch {
      return false;
    }
  }

  if (rule.type === "domSelector") {
    const document = new DOMParser().parseFromString(files.html, "text/html");
    return document.querySelectorAll(rule.selector).length >= (rule.minCount ?? 1);
  }

  if (rule.type === "consoleIncludes") {
    const haystack = normalize(consoleLines.join("\n"), rule.caseSensitive);
    return haystack.includes(normalize(rule.value, rule.caseSensitive));
  }

  if (rule.type === "keywords") {
    const haystack = normalize(files[rule.field], rule.caseSensitive);
    const matches = rule.values.filter((value) =>
      haystack.includes(normalize(value, rule.caseSensitive)),
    );

    return matches.length >= (rule.minMatches ?? rule.values.length);
  }

  if (rule.type === "tableAnswer") {
    const tableAnswers = parseTableAnswers(files.html);

    return Object.entries(rule.answers).every(([row, columns]) =>
      Object.entries(columns).every(([column, expected]) => {
        const actual = tableAnswers[row]?.[column] ?? "";

        return normalize(actual.trim(), rule.caseSensitive) ===
          normalize(expected.trim(), rule.caseSensitive);
      }),
    );
  }

  return false;
}

export function validateExercise(
  rules: ValidationRule[],
  files: CodeFiles,
  consoleLines: string[],
): ValidationResult[] {
  return rules.map((rule) => ({
    passed: evaluateRule(rule, files, consoleLines),
    message: rule.message,
    rule,
  }));
}
