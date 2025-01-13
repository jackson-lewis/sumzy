import TransactionDialog from '@/components/transaction/dialog'
import TransactionsProvider from '@/lib/transactions-context'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/lib/swr', () => ({
  __esModule: true,
  useTx: jest.fn(() => {
    return {
      data: [],
      trigger: jest.fn()
    }
  }),
  useCategories: jest.fn(() => {
    return {
      data: {
        defaultCategories: [],
        userCategories: []
      }
    }
  })
}))

jest.mock('next/dist/client/form', () => ({
	useAppOrPagesRouter: jest.fn().mockReturnValue({
		asPath: '/some-path'
	})
}))


describe('Render transaction dialog', () => {
  it('should render the transaction dialog', async () => {
    const user = userEvent.setup()
    const wrapper = ({ children }: {
      children: React.ReactNode
    }) => (
      <TransactionsProvider>
        {children}
      </TransactionsProvider>
    )

    const { getByText, getByLabelText } = render(
      <TransactionDialog />,
      { wrapper }
    )

    await user.click(getByLabelText('Income'))

    expect(getByText('Income')).toBeInTheDocument()
  })
})