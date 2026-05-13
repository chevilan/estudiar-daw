import { Copy, Lightbulb, XCircle } from "lucide-react";

import DiffViewer from "@/components/DiffViewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CodeFiles, ValidationField, ValidationResult } from "@/lib/types";

type GiveUpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userFiles: CodeFiles;
  targetCode?: CodeFiles;
  activeFile: ValidationField;
  validationResults: ValidationResult[];
  hasRunValidation: boolean;
  fileLabels: Record<ValidationField, string>;
  onCopySolution: () => void;
};

const fields: ValidationField[] = ["html", "css", "javascript"];

export default function GiveUpDialog({
  open,
  onOpenChange,
  userFiles,
  targetCode,
  activeFile,
  validationResults,
  hasRunValidation,
  fileLabels,
  onCopySolution,
}: GiveUpDialogProps) {
  const failedResults = validationResults.filter((r) => !r.passed);
  const hasTarget = Boolean(targetCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-4 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb size={18} className="text-warning" aria-hidden />
            Ver solución
          </DialogTitle>
          <DialogDescription>
            {hasTarget
              ? "Compara tu código con la solución objetivo."
              : "Revisa los criterios que aún no cumples."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6">
          {hasTarget ? (
            <Tabs defaultValue={activeFile} className="flex min-h-0 flex-1 flex-col">
              <TabsList className="w-fit">
                {fields.map((field) => (
                  <TabsTrigger key={field} value={field} className="text-xs">
                    {fileLabels[field] ?? field.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              {fields.map((field) => (
                <TabsContent
                  key={field}
                  value={field}
                  className="mt-2 flex min-h-0 flex-1 flex-col data-[state=active]:flex"
                >
                  <div className="mb-1.5 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                    <span>Tu código → Solución</span>
                    {userFiles[field] === targetCode![field] ? (
                      <span className="text-success">Idéntico</span>
                    ) : (
                      <span className="text-warning">Hay diferencias</span>
                    )}
                  </div>
                  <DiffViewer
                    oldValue={userFiles[field]}
                    newValue={targetCode![field]}
                    className="max-h-[50vh] flex-1"
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex flex-1 flex-col gap-3 overflow-auto">
              {!hasRunValidation ? (
                <div className="rounded-md border border-border bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
                  Pulsa <strong>Comprobar</strong> primero para ver qué necesitas
                  corregir.
                </div>
              ) : failedResults.length === 0 ? (
                <div className="rounded-md border border-success/30 bg-success-soft px-4 py-6 text-center text-sm text-success">
                  ¡Tu solución ya cumple todos los criterios!
                </div>
              ) : (
                <>
                  <p className="m-0 text-sm text-muted-foreground">
                    Este ejercicio no tiene una solución única. Revisa los
                    criterios que aún no cumples:
                  </p>
                  <ul className="m-0 grid list-none gap-1.5 overflow-auto p-0">
                    {failedResults.map((result, index) => (
                      <li
                        key={`${index}-${result.message}`}
                        className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm leading-snug text-destructive"
                      >
                        <span className="mt-0.5">
                          <XCircle size={14} aria-hidden />
                        </span>
                        <span>{result.message}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-secondary/40 px-6 py-4">
          {hasTarget && (
            <Button variant="default" onClick={onCopySolution}>
              <Copy size={14} aria-hidden />
              Copiar solución
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
