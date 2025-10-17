'use client'

import { useMerchants } from '@/lib/swr'

export default function MerchantsList() {
  const { data: merchants = [] } = useMerchants()

  return (
    <>
      <ul className="mb-8 divide-y">
        {merchants.length === 0 ? (
          <li className="py-4 text-muted-foreground">No merchants found.</li>
        ) : (
          merchants.map((merchant) => (
            <li key={merchant.id} className="py-4">
              {merchant.name}
            </li>
          ))
        )}
      </ul>
    </>
  )
}
