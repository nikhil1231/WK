import { ProgressBar } from 'react-bootstrap'
import type { PageConfig } from '../config/pagesConfig'

type Props = {
  steps: PageConfig[]
  activeIndex: number
}

const StepProgress = ({ steps, activeIndex }: Props) => {
  const progress = ((activeIndex + 1) / steps.length) * 100

  return (
    <section className="step-progress rounded-4 bg-body p-4 shadow-sm mb-4">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`step-chip d-flex align-items-center gap-2 ${
              idx === activeIndex ? 'current' : idx < activeIndex ? 'complete' : ''
            }`}
          >
            <span className="step-index">{idx + 1}</span>
            <span>{step.shortLabel ?? step.title}</span>
          </div>
        ))}
      </div>
      <ProgressBar now={progress} aria-label={`Step ${activeIndex + 1} of ${steps.length}`} />
    </section>
  )
}

export default StepProgress

