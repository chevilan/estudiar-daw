import { useMemo } from "react";

import { cn } from "@/lib/utils";
import type { CodeFiles } from "../lib/types";
import { createPreviewDocument } from "../lib/preview";

type PreviewFrameProps = {
  files: CodeFiles;
  title: string;
  channelId: string;
  className?: string;
  resizable?: boolean;
};

export default function PreviewFrame({
  files,
  title,
  channelId,
  className,
  resizable = false,
}: PreviewFrameProps) {
  const srcDoc = useMemo(
    () => createPreviewDocument(files, channelId),
    [files, channelId],
  );

  return (
    <div
      className={cn(
        "relative w-full",
        resizable && "resize-y overflow-auto pb-3",
        className,
      )}
    >
      <iframe
        className="h-full min-h-[360px] w-full rounded-md border bg-white"
        title={title}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
      />
    </div>
  );
}
