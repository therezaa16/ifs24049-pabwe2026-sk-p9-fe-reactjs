export default function PostStats({ stats }) {
  const cards = [
    { label: 'Total Artikel', value: stats?.total_articles ?? 0 },
    { label: 'Terbit', value: stats?.total_selesai ?? 0 },
    { label: 'Draf', value: stats?.belum_selesai ?? 0 },
  ]
  return (
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3" aria-label="Ringkasan statistik artikel">
      {cards.map((c) => (
        <li key={c.label} className="card p-5">
          <p className="muted m-0 font-medium">{c.label}</p>
          <p className="m-0 text-4xl font-extrabold">{c.value}</p>
        </li>
      ))}
    </ul>
  )
}
