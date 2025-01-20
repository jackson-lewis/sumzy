import { render } from '@testing-library/react'
import { Button } from '@/components/shared/button'

describe('Button', () => {
  it('should render a button with the text "Click me"', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })
})
