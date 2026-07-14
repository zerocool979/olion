// FIX: sebelumnya mengira `mode` bernilai ANONYMOUS/IDENTIFIED (bukan enum
// yang sungguh ada di backend — lihat schema.prisma DiscussionMode), jadi
// selalu jatuh ke fallback yang menampilkan nama enum mentah apa adanya
// (mis. "ARGUMENTATIF"). Sekarang dipetakan ke label yang sama dipakai di
// seluruh app (DiscussionContent, DiscussionMeta, BookmarkCard).
const MODE_LABELS = {
  INFORMATIF: 'Informatif',
  KLARIFIKATIF: 'Klarifikasi',
  EKSPLORATIF: 'Eksploratif',
  EVALUATIF: 'Evaluatif',
  ARGUMENTATIF: 'Argumentatif',
};

export default function ModeBadge({ mode }) {
  if (!mode) return null;
  const label = MODE_LABELS[mode] ?? mode;
  return <span className="mode-badge mode-badge--identified">{label}</span>;
}
