export function ReportStep({ step }) {
  return (
    <div className="legal-report-step">
      <span className="legal-report-step__num">{step.step}</span>
      <div>
        <strong className="legal-report-step__title">{step.title}</strong>
        <p className="legal-report-step__desc">{step.desc}</p>
      </div>
    </div>
  )
}



