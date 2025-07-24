import { render } from '@testing-library/react'
import { ReactElement } from 'react'

// Simple render function for testing
export function renderWithProviders(
  ui: ReactElement,
  options: {
    locale?: string
    messages?: Record<string, any>
  } = {}
) {
  // Simple wrapper without complex providers for basic testing
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="test-wrapper">{children}</div>
  }

  return render(ui, { wrapper: Wrapper })
}

// Re-export everything from testing-library/react
export * from '@testing-library/react'
export { renderWithProviders as render }