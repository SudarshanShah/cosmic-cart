import { Spinner } from './Spinner'

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Spinner className="h-8 w-8 text-pink-400" />
    </div>
  )
}