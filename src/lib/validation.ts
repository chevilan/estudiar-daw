import type { CodeFiles, ValidationResult, ValidationRule } from "./types";

const normalize = (value: string, caseSensitive = false) =>
  caseSensitive ? value : value.toLowerCase();

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
