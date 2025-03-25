import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Link href="/teacher-dashboard/create-quiz">
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Create Quiz
        </Button>
      </Link>
    </div>
  )
}
