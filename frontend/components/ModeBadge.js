const MODE_STYLES = {
  ANONYMOUS: 'mode-badge mode-badge--anonymous',
  IDENTIFIED: 'mode-badge mode-badge--identified',
};

export default function ModeBadge({ mode }) {
  const className = MODE_STYLES[mode] || 'mode-badge mode-badge--default';
  const label =
    mode === 'ANONYMOUS' ? 'Anonim' : mode === 'IDENTIFIED' ? 'Publik' : mode;

  return <span className={className}>{label}</span>;
}



