import { Col, Row, Button } from 'react-bootstrap'
import type { PageConfig } from '../config/pagesConfig'

type Props = {
  config: PageConfig
  selectedValues: string[]
  onChange: (values: string[]) => void
}

const MultiSelectPage = ({ config, selectedValues, onChange }: Props) => {
  const toggleValue = (value: string) => {
    const next = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value]
    onChange(next)
  }

  return (
    <section className="multiselect-page rounded-4 shadow-sm bg-body p-4">
      <header className="mb-4">
        <p className="eyebrow text-uppercase fw-semibold text-primary mb-2">
          {config.shortLabel ?? config.title}
        </p>
        <h1 className="h3 fw-bold mb-2">{config.title}</h1>
        {config.description && <p className="text-body-secondary mb-0">{config.description}</p>}
      </header>

      <Row xs={1} sm={2} lg={3} className="g-3">
        {config.options.map((option) => {
          const isActive = selectedValues.includes(option.value)
          return (
            <Col key={option.value}>
              <Button
                size="lg"
                variant={isActive ? 'primary' : 'outline-primary'}
                className="w-100 text-start option-button"
                onClick={() => toggleValue(option.value)}
              >
                <div className="fw-semibold">{option.label}</div>
                {option.helperText && <small className="text-body-secondary">{option.helperText}</small>}
              </Button>
            </Col>
          )
        })}
      </Row>
    </section>
  )
}

export default MultiSelectPage

