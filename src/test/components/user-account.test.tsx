import { render } from '@testing-library/react'
import AccountForm from '@/components/dashboard/account'

jest.mock('@/lib/actions/user', () => ({
  __esModule: true,
  updateUser: jest.fn(() => {
    return {
      name: 'John Doe',
      email: ''
    }
  })
}))

jest.mock('next/dist/client/form', () => ({
  useAppOrPagesRouter: jest.fn().mockReturnValue({
    asPath: '/some-path'
  })
}))

jest.mock('@/lib/swr', () => ({
  __esModule: true,
  useUser: jest.fn(() => {
    return {
      data: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      mutate: jest.fn()
    }
  })
}))

describe('Render user account', () => {
  it('should render the user account', async () => {
    const { getByTestId } = render(<AccountForm />)

    expect(getByTestId('name')).toHaveDisplayValue('John Doe')
    expect(getByTestId('email')).toHaveDisplayValue('john@example.com')
  })
})
