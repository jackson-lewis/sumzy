import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Example data array (replace with your actual data source)
const rawData: { name: string; amount: number }[] = [
  { name: '2021-10', amount: 7158.09 },
  { name: '2021-11', amount: 8502.04 },
  { name: '2021-12', amount: 8936.71 },
  { name: '2022-01', amount: 9660.88 },
  { name: '2022-02', amount: 10521.2 },
  { name: '2022-03', amount: 12205.9 },
  { name: '2022-04', amount: 13077.37 },
  { name: '2022-05', amount: 13477.04 },
  { name: '2022-08', amount: 13124.59 },
  { name: '2022-09', amount: 13531.82 },
  { name: '2022-12', amount: 15513.23 },
  { name: '2023-01', amount: 16095.69 },
  { name: '2023-02', amount: 16798.16 },
  { name: '2023-03', amount: 17332.35 },
  { name: '2023-04', amount: 18349.33 },
  { name: '2023-05', amount: 18887.5 },
  { name: '2023-06', amount: 19374.59 },
  { name: '2023-07', amount: 19880.94 },
  { name: '2023-08', amount: 20057.14 },
  { name: '2023-09', amount: 20114.33 },
  { name: '2023-10', amount: 20154.98 },
  { name: '2023-11', amount: 20095.29 },
  { name: '2023-12', amount: 20354.24 },
  { name: '2024-01', amount: 20444.53 },
  { name: '2024-02', amount: 20475.0 },
  { name: '2024-03', amount: 20489.1 },
  { name: '2024-04', amount: 21579.77 },
  { name: '2024-05', amount: 21507.67 },
  { name: '2024-06', amount: 19476.98 },
  { name: '2024-07', amount: 19391.65 },
  { name: '2024-08', amount: 20132.61 },
  { name: '2024-09', amount: 20735.85 },
  { name: '2024-10', amount: 20820.22 },
  { name: '2024-11', amount: 20856.49 },
  { name: '2024-12', amount: 20952.79 },
  { name: '2025-01', amount: 20987.21 },
  { name: '2025-02', amount: 22131.52 },
  { name: '2025-03', amount: 22609.23 },
  { name: '2025-04', amount: 22554.3 },
  { name: '2025-05', amount: 23161.34 },
  { name: '2025-06', amount: 23793.44 }
]

// Set your CustomTracking id here (trackId must exist in the DB)
const TRACK_ID = 2

export async function POST() {
  try {
    const created = await prisma.customTrackingMeta.createMany({
      data: rawData.map((item) => ({
        trackId: TRACK_ID,
        amount: item.amount,
        date: new Date(item.name + '-01')
      })),
      skipDuplicates: true
    })
    return NextResponse.json({ success: true, count: created.count })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : error
    })
  }
}
