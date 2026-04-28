import { useMemo } from "react";

import { cn } from "@/lib/utils";
import type { CodeFiles } from "../lib/types";
import { createPreviewDocument } from "../lib/preview";

type PreviewFrameProps = {
  files: CodeFiles;
  title: string;
  channelId: string;
  className?: string;
};

export default function PreviewFrame({
  files,
  title,
  channelId,
  className,
}: PreviewFrameProps) {
  const srcDoc = useMemo(
    () => createPreviewDocument(files, channelId),
    [files, channelId],
  );

  return (
    <iframe
      className={cn(
        "min-h-[360px] w-full rounded-md border bg-white",
        className,
      )}
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
    />
  );
}
