import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'

// Simple component for testing
function TestComponent({ message }: { message: string }) {
  return <div data-testid="test-message">{message}</div>
}

describe('Test Setup', () => {
  it('should render components correctly', () => {
    const testMessage = 'Hello Test'
    render(<TestComponent message={testMessage} />)
    
    const messageElement = screen.getByTestId('test-message')
    expect(messageElement).toBeInTheDocument()
    expect(messageElement).toHaveTextContent(testMessage)
  })

  it('should handle providers correctly', () => {
    render(<div data-testid="provider-test">Test with providers</div>)
    
    const element = screen.getByTestId('provider-test')
    expect(element).toBeInTheDocument()
  })
})