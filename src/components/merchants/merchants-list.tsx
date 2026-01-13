'use client'

import { favoriteMerchant } from '@/lib/actions/merchant'
import { useMerchants, useUser } from '@/lib/swr'
import { Star } from './icons'

export default function MerchantsList() {
  const { data: merchants = [], mutate } = useMerchants()
  const { data: user } = useUser()

  async function handleFavorite(merchantId: number) {
    await favoriteMerchant(merchantId)
    mutate()
  }

  return (
    <>
      <ul className="mb-8 divide-y">
        {merchants.length === 0 ? (
          <li className="py-4 text-muted-foreground">No merchants found.</li>
        ) : (
          merchants.map((merchant) => {
            const isFavorited = merchant.favorites?.some(
              (u) => u.id === user?.id
            )
            return (
              <li
                key={merchant.id}
                className="py-4 flex items-center justify-between"
              >
                <span>{merchant.name}</span>
                <button
                  className="ml-4 px-2 py-1 rounded"
                  aria-label={isFavorited ? 'Unfavorite' : 'Favorite'}
                  onClick={() => handleFavorite(merchant.id)}
                  type="button"
                >
                  <Star
                    className={
                      isFavorited
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground'
                    }
                    fill={isFavorited ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                    size={24}
                  />
                </button>
              </li>
            )
          })
        )}
      </ul>
    </>
  )
}
