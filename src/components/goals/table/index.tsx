import { getCustomTrackingMeta } from '@/lib/actions/get-custom-tracking-meta'

export default async function Table({ id }: { id: number }) {
  const data = await getCustomTrackingMeta(id)

  return (
    <table
      style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}
    >
      <thead>
        <tr>
          <th
            style={{
              borderBottom: '1px solid #ccc',
              textAlign: 'left',
              padding: '0.5rem'
            }}
          >
            Date
          </th>
          <th
            style={{
              borderBottom: '1px solid #ccc',
              textAlign: 'right',
              padding: '0.5rem'
            }}
          >
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {data.reverse().map((row) => (
          <tr key={row.date.toString()}>
            <td style={{ padding: '0.5rem' }}>
              {new Date(row.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short'
              })}
            </td>
            <td style={{ padding: '0.5rem', textAlign: 'right' }}>
              {Number(row.amount).toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 2
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
