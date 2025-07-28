import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default async function TableComponent({ id }: { id: number }) {
  const data = await getCustomTrackingMeta(id)

  return (
    <Table className="mt-8">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.reverse().map((row) => (
          <TableRow key={row.date.toString()}>
            <TableCell>
              {new Date(row.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short'
              })}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums w-32">
              {Number(row.amount).toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 2
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
