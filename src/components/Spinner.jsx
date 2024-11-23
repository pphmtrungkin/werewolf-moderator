import React from 'react'

export default function Spinner() {
  return (
<div class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
  <span class="sr-only">Loading...</span>
</div>
  )
}
