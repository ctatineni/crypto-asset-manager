import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Filters */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />

            <div className="pt-4 border-t">
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Center panel - Graph */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative border rounded-md h-[600px] bg-slate-50 dark:bg-slate-900">
              <Skeleton className="w-full h-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
