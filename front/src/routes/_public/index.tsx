import Heros from '@/components/publics/others/Heros'
import { createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Heros/>
    </>
  )
}