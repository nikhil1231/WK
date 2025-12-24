import { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Stack } from 'react-bootstrap'
import StepProgress from './components/StepProgress'
import MultiSelectPage from './components/MultiSelectPage'
import { pagesConfig } from './config/pagesConfig'

type SelectionState = Record<string, string[]>

const buildInitialSelections = (): SelectionState =>
  pagesConfig.reduce((acc, page) => {
    acc[page.id] = []
    return acc
  }, {} as SelectionState)

const App = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<SelectionState>(buildInitialSelections)
  const [submitted, setSubmitted] = useState(false)

  const activePage = pagesConfig[currentStep]
  const isLastStep = currentStep === pagesConfig.length - 1
  const selectedValues = selections[activePage.id] ?? []

  const isCurrentStepValid = activePage.required ? selectedValues.length > 0 : true

  const summary = useMemo(() => {
    return pagesConfig.map((page) => {
      const values = selections[page.id] ?? []
      const labels = values.map(
        (value) => page.options.find((option) => option.value === value)?.label ?? value,
      )
      return {
        id: page.id,
        title: page.shortLabel ?? page.title,
        values: labels,
      }
    })
  }, [selections])

  const updateSelections = (pageId: string, values: string[]) => {
    setSelections((prev) => ({ ...prev, [pageId]: values }))
    setSubmitted(false)
  }

  const goToPrevious = () => setCurrentStep((step) => Math.max(step - 1, 0))
  const goToNext = () => setCurrentStep((step) => Math.min(step + 1, pagesConfig.length - 1))

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <Container fluid className="py-5 app-shell">
      <Row className="justify-content-center">
        <Col xs={12} xl={8}>
          <StepProgress steps={pagesConfig} activeIndex={currentStep} />
          <MultiSelectPage
            config={activePage}
            selectedValues={selectedValues}
            onChange={(values) => updateSelections(activePage.id, values)}
          />
          <Stack direction="horizontal" gap={3} className="flex-wrap justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={goToPrevious}
              disabled={currentStep === 0}
              className="flex-grow-1 flex-sm-grow-0"
            >
              Back
            </Button>
            <div className="ms-sm-auto d-flex gap-3 flex-grow-1 flex-sm-grow-0">
              {!isLastStep && (
                <Button
                  variant="primary"
                  onClick={goToNext}
                  disabled={!isCurrentStepValid}
                  className="flex-grow-1 flex-sm-grow-0"
                >
                  Next
                </Button>
              )}
              {isLastStep && (
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid}
                  className="flex-grow-1 flex-sm-grow-0"
                >
                  Submit
                </Button>
              )}
            </div>
          </Stack>
        </Col>
        <Col xs={12} xl={4} className="mt-4 mt-xl-0">
          <Card className="summary-card shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="h5">
                Your selections
              </Card.Title>
              <Card.Text className="text-body-secondary">
                This updates in real time so you can sanity-check before submitting.
              </Card.Text>
              <Stack gap={3}>
                {summary.map(({ id, title, values }) => (
                  <div key={id}>
                    <p className="fw-semibold mb-2">{title}</p>
                    {values.length === 0 ? (
                      <p className="text-body-tertiary mb-0">Nothing picked yet.</p>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {values.map((value) => (
                          <span key={value} className="badge rounded-pill bg-primary-subtle text-primary-emphasis">
                            {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Stack>
              {submitted && (
                <Alert variant="success" className="mt-4 mb-0">
                  Looks good — we captured your picks. You can tweak them anytime.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default App

