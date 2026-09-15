import { FileCode2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { AffectedFile, CallPathRole } from '@/types/incident';

const ROLE_LABELS: Record<CallPathRole, string> = {
  ENTRY_CONTROLLER: 'AMS controller',
  ENTRY_SERVICE: 'AMS service',
  PROXY_CALL: 'Proxy call',
  DOWNSTREAM_CONTROLLER: 'CMS controller',
  DOWNSTREAM_SERVICE: 'CMS service',
};

interface AffectedFilesListProps {
  files: AffectedFile[];
}

export function AffectedFilesList({ files }: AffectedFilesListProps) {
  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground">No affected files identified.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Repository</th>
            <th className="px-4 py-2 font-medium">Path</th>
            <th className="px-4 py-2 font-medium">Role</th>
            <th className="px-4 py-2 font-medium">Lines</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={`${file.repo}-${file.path}-${file.lines}`} className="border-t">
              <td className="px-4 py-3 font-medium">{file.repo}</td>
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FileCode2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <code className="break-all text-xs">{file.path}</code>
                </div>
              </td>
              <td className="px-4 py-3">
                {file.role ? (
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABELS[file.role]}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{file.lines}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
