import { Skeleton } from "@/components/ui/skeleton"; // Votre composant créé à l'étape 1

const SKELETON_ROWS = 5;
const SKELETON_COLS = 4;

export function SkeletonTable() {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {Array.from({ length: SKELETON_COLS }).map((_, index) => (
              <th key={index} className="h-12 px-4 text-left font-medium">
                <Skeleton className="h-5 w-24" />
              </th>
            ))}
            <th className="h-12 px-4 text-right font-medium">
              <Skeleton className="h-5 w-16" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Array.from({ length: SKELETON_COLS }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <Skeleton className="h-5 w-full" />
                </td>
              ))}
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                   <Skeleton className="h-8 w-8 rounded-md" /> {/* Un peu plus de style */}
                   <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}