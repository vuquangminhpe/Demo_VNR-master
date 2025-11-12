import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { characters } from '../data/characters'
import type { Domain } from '../types'

type FilterState = {
  query: string
  period: string
  domain: Domain | 'all'
}

const periods = [
  '1910-1945',
  '1945-1975',
  '1975-1986',
  '1986-nay'
]

const domainLabels: Record<Domain, string> = {
  chinh_tri: 'Chính trị',
  quan_su: 'Quân sự',
  ngoai_giao: 'Ngoại giao',
  tu_tuong: 'Tư tưởng',
  kinh_te: 'Kinh tế'
}

const inferPeriod = (activePeriod: string): string => {
  const [startStr] = activePeriod.split('-')
  const startYear = parseInt(startStr.trim(), 10)
  if (startYear <= 1945) return '1910-1945'
  if (startYear <= 1975) return '1945-1975'
  if (startYear <= 1986) return '1975-1986'
  return '1986-nay'
}

const pageSize = 6

const CharacterListPage = () => {
  const [filters, setFilters] = useState<FilterState>({ query: '', period: 'all', domain: 'all' })
  const [page, setPage] = useState(1)

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = filters.query.toLowerCase().trim()

    return characters.filter((character) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        character.name.toLowerCase().includes(normalizedQuery) ||
        character.title.toLowerCase().includes(normalizedQuery)

      const periodForCharacter = inferPeriod(character.personal_info.active_period)
      const matchesPeriod = filters.period === 'all' || periodForCharacter === filters.period

      const matchesDomain =
        filters.domain === 'all' || character.domains?.includes(filters.domain)

      return matchesQuery && matchesPeriod && matchesDomain
    })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredCharacters.length / pageSize))
  const pagedCharacters = filteredCharacters.slice((page - 1) * pageSize, page * pageSize)

  const updateFilter = (nextFilter: Partial<FilterState>) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, ...nextFilter }))
  }

  return (
    <div className="character-list-page">
      <section className="section container">
        <header className="section-head">
          <p className="kicker">Khám phá lãnh tụ</p>
          <h1>Danh sách nhân vật</h1>
          <p>Tìm kiếm, lọc theo thời kỳ hoặc lĩnh vực đóng góp để tìm hiểu sâu hơn.</p>
        </header>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="search">Tìm theo tên hoặc chức vụ</label>
            <input
              id="search"
              type="search"
              placeholder="Nhập tên nhân vật..."
              value={filters.query}
              onChange={(event) => updateFilter({ query: event.target.value })}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="period">Thời kỳ hoạt động</label>
              <select
                id="period"
                value={filters.period}
                onChange={(event) => updateFilter({ period: event.target.value })}
              >
                <option value="all">Tất cả</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period.replace('-', ' – ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="domain">Lĩnh vực đóng góp</label>
              <select
                id="domain"
                value={filters.domain}
                onChange={(event) => updateFilter({ domain: event.target.value as FilterState['domain'] })}
              >
                <option value="all">Tất cả</option>
                {Object.entries(domainLabels).map(([domain, label]) => (
                  <option key={domain} value={domain}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="character-grid">
          {pagedCharacters.map((character) => (
            <article key={character.id} className="character-card">
              <div className="card-thumb">
                <img src={character.image} alt={character.name} />
              </div>
              <div className="card-body">
                <h2>{character.name}</h2>
                <p className="card-title">{character.title}</p>
                <p className="card-description">{character.description}</p>
                <div className="card-tags">
                  {character.domains?.map((domain) => (
                    <span key={domain}>{domainLabels[domain]}</span>
                  ))}
                </div>
                <Link className="btn tertiary" to={`/nhan-vat/${character.id}`}>
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy nhân vật phù hợp. Hãy điều chỉnh bộ lọc và thử lại.</p>
          </div>
        )}

        {filteredCharacters.length > pageSize && (
          <div className="pagination">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              ← Trước
            </button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Sau →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default CharacterListPage
