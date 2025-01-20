import { fireEvent, render, screen } from '@testing-library/react'
import SignUpForm from '@/components/site/user/sign-up'

describe('New password', () => {
  it('should match passwords', async () => {
    render(<SignUpForm />)

    fireEvent.change(screen.getByTestId('password'), {
      target: {
        value: 'Password1!'
      }
    })

    fireEvent.change(screen.getByTestId('password_confirm'), {
      target: {
        value: 'Password1!'
      }
    })

    const length = screen.getByTestId('length')
    expect(length.dataset.pass).toBe(true)
  })
})
