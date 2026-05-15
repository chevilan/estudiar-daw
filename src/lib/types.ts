export type Topic = "html" | "css" | "javascript" | "jsp" | "servlets";

export type ExerciseType = "build" | "visual-match";

export type CodeFiles = {
  html: string;
  css: string;
  javascript: string;
};

export type ValidationField = keyof CodeFiles;

export type EditorLanguage = ValidationField | "java" | "plain";

export type ValidationRule =
  | {
      type: "contains";
      field: ValidationField;
      value: string;
      message: string;
      caseSensitive?: boolean;
    }
  | {
      type: "notContains";
      field: ValidationField;
      value: string;
      message: string;
      caseSensitive?: boolean;
    }
  | {
      type: "regex";
      field: ValidationField;
      pattern: string;
      flags?: string;
      message: string;
    }
  | {
      type: "domSelector";
      selector: string;
      minCount?: number;
      message: string;
    }
  | {
      type: "consoleIncludes";
      value: string;
      message: string;
      caseSensitive?: boolean;
    };

export type ExerciseValidation = {
  mode: "all";
  successMessage: string;
  rules: ValidationRule[];
};

export type Exercise = {
  id: string;
  topic: Topic;
  type: ExerciseType;
  title: string;
  difficulty: "base" | "media" | "reto";
  estimatedMinutes: number;
  prompt: string;
  notes?: string[];
  starterCode: CodeFiles;
  targetCode?: CodeFiles;
  validation: ExerciseValidation;
};

export type ExerciseManifest = {
  files: string[];
};

export type ValidationResult = {
  passed: boolean;
  message: string;
  rule: ValidationRule;
};

export type ExerciseProgress = {
  completed: boolean;
  lastEditedAt: string;
  attempts: number;
};
