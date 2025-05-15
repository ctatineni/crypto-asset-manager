import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
      </div>

      <div className="w-[400px]">
        <Skeleton className="h-10 w-full" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />

          <div className="flex flex-wrap gap-4 mt-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-96" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 h-[600px]">
            <Skeleton className="flex-1 rounded-md" />
            <Skeleton className="w-80 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
