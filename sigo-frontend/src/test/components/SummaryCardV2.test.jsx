import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/test-utils'
import SummaryCardV2 from '../../features/dashboard/components/SummaryCardV2'
import { Users, BookOpen, CheckCircle } from 'lucide-react'

describe('SummaryCardV2 Component', () => {
  it('renders card with title and value', () => {
    render(
      <SummaryCardV2
        title="Total Usuarios"
        value="150"
        icon={<Users className="h-6 w-6" />}
      />
    )

    expect(screen.getByText('Total Usuarios')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders with default blue color', () => {
    render(
      <SummaryCardV2
        title="Test Card"
        value="100"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const card = document.querySelector('.bg-blue-500')
    expect(card).toBeInTheDocument()
  })

  it('renders with different colors', () => {
    const { rerender } = render(
      <SummaryCardV2
        title="Green Card"
        value="50"
        color="green"
        icon={<CheckCircle className="h-6 w-6" />}
      />
    )

    expect(document.querySelector('.bg-green-500')).toBeInTheDocument()

    rerender(
      <SummaryCardV2
        title="Red Card"
        value="25"
        color="red"
        icon={<BookOpen className="h-6 w-6" />}
      />
    )

    expect(document.querySelector('.bg-red-500')).toBeInTheDocument()

    rerender(
      <SummaryCardV2
        title="Violet Card"
        value="75"
        color="violet"
        icon={<Users className="h-6 w-6" />}
      />
    )

    expect(document.querySelector('.bg-violet-500')).toBeInTheDocument()

    rerender(
      <SummaryCardV2
        title="Yellow Card"
        value="200"
        color="yellow"
        icon={<CheckCircle className="h-6 w-6" />}
      />
    )

    expect(document.querySelector('.bg-yellow-400')).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    const customIcon = <BookOpen className="h-8 w-8" />
    render(
      <SummaryCardV2
        title="Custom Icon"
        value="300"
        icon={customIcon}
      />
    )

    expect(screen.getByText('Custom Icon')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    render(
      <SummaryCardV2
        title="Test Card"
        value="100"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const card = document.querySelector('.rounded-xl.shadow-md.text-white')
    expect(card).toBeInTheDocument()
  })

  it('renders title with correct styling', () => {
    render(
      <SummaryCardV2
        title="Styled Title"
        value="100"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const title = screen.getByText('Styled Title')
    expect(title).toHaveClass('text-xs', 'sm:text-sm', 'uppercase', 'tracking-wide', 'opacity-90')
  })

  it('renders value with correct styling', () => {
    render(
      <SummaryCardV2
        title="Test Card"
        value="999"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const value = screen.getByText('999')
    expect(value).toHaveClass('text-3xl', 'sm:text-4xl', 'font-bold', 'mt-1')
  })

  it('renders icon container with correct styling', () => {
    render(
      <SummaryCardV2
        title="Test Card"
        value="100"
        color="green"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const iconContainer = document.querySelector('.rounded-full')
    expect(iconContainer).toHaveClass('p-2', 'sm:p-3', 'rounded-full', 'bg-green-600')
  })

  it('handles invalid color gracefully', () => {
    render(
      <SummaryCardV2
        title="Invalid Color"
        value="100"
        color="invalid"
        icon={<Users className="h-6 w-6" />}
      />
    )

    const card = document.querySelector('.bg-blue-500')
    expect(card).toBeInTheDocument()
  })

  it('renders with numeric value', () => {
    render(
      <SummaryCardV2
        title="Numeric Value"
        value={42}
        icon={<Users className="h-6 w-6" />}
      />
    )

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders with string value', () => {
    render(
      <SummaryCardV2
        title="String Value"
        value="N/A"
        icon={<Users className="h-6 w-6" />}
      />
    )

    expect(screen.getByText('N/A')).toBeInTheDocument()
  })
})
