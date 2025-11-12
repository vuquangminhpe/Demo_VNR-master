import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { characterById } from '../data/characters'

const formatLabel = (label: string) =>
  label
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const CharacterDetailPage = () => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const characterId = Number(params.id)
  const character = characterById.get(characterId)

  const relatedCharacters = useMemo(() => {
    if (!character) return []
    return character.related
      .map((relatedId) => characterById.get(relatedId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 3)
  }, [character])

  if (!character) {
    return (
      <div className="container section detail-page">
        <div className="empty-state">
          <p>Không tìm thấy nhân vật bạn yêu cầu.</p>
          <div className="empty-actions">
            <button type="button" className="btn secondary" onClick={() => navigate(-1)}>
              Quay lại
            </button>
            <Link className="btn primary" to="/nhan-vat">
              Danh sách nhân vật
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="hero-section">
        <div className="container hero-layout">
          <div className="hero-media">
            <img src={character.image} alt={character.name} />
            {character.signature && (
              <figure className="signature">
                <img src={character.signature} alt={`Chữ ký ${character.name}`} />
                <figcaption>Chữ ký</figcaption>
              </figure>
            )}
          </div>
          <div className="hero-content">
            <p className="kicker">Chân dung lãnh tụ</p>
            <h1>{character.name}</h1>
            <p className="hero-title">{character.title}</p>
            <div className="hero-meta">
              <div>
                <span>Sinh:</span>
                <strong>{character.personal_info.birth}</strong>
              </div>
              <div>
                <span>Mất:</span>
                <strong>{character.personal_info.death}</strong>
              </div>
              <div>
                <span>Quê quán:</span>
                <strong>{character.personal_info.hometown}</strong>
              </div>
              <div>
                <span>Thời kỳ hoạt động:</span>
                <strong>{character.personal_info.active_period}</strong>
              </div>
              <div>
                <span>Năm vào Đảng:</span>
                <strong>{character.personal_info.party_membership}</strong>
              </div>
            </div>
            <p className="hero-description">{character.description}</p>
            <div className="hero-actions">
              <a className="btn primary" href="#timeline">
                Dòng thời gian
              </a>
              <a className="btn ghost" href="#resources">
                Tư liệu quý
              </a>
            </div>
          </div>
        </div>
      </div>

      <section id="timeline" className="timeline-section section">
        <div className="container">
          <header className="section-head">
            <p className="kicker">Dòng thời gian</p>
            <h2>Những dấu mốc nổi bật</h2>
          </header>
          <div className="timeline">
            {character.timeline.map((item) => (
              <div key={item.year} className="timeline-item">
                <div className="timeline-year">
                  <span>{item.year}</span>
                </div>
                <div className="timeline-body">
                  {item.image && (
                    <div className="timeline-media">
                      <img src={item.image} alt={item.event} />
                    </div>
                  )}
                  <p>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contribution-section section">
        <div className="container">
          <div className="contribution-grid">
            <div className="contribution-block">
              <header>
                <span className="icon" aria-hidden>⭐</span>
                <h2>Đóng góp tiêu biểu</h2>
              </header>
              <ul>
                {character.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </div>
            <div className="contribution-block">
              <header>
                <span className="icon" aria-hidden>📜</span>
                <h2>Tư tưởng &amp; triết lý</h2>
              </header>
              <ul>
                {character.thoughts.map((thought) => (
                  <li key={thought}>{thought}</li>
                ))}
              </ul>
            </div>
            <div className="contribution-block">
              <header>
                <span className="icon" aria-hidden>💬</span>
                <h2>Trích dẫn tiêu biểu</h2>
              </header>
              <ul>
                {character.resources
                  .filter((resource) => resource.type === 'quote' && resource.content)
                  .map((resource) => (
                    <li key={resource.content}>{resource.content}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="resources-section section">
        <div className="container">
          <header className="section-head">
            <p className="kicker">Tư liệu quý</p>
            <h2>Kho tư liệu chọn lọc</h2>
          </header>
          <div className="resource-grid">
            {character.resources.map((resource, index) => (
              <article key={`${resource.type}-${index}`} className={`resource-card ${resource.type}`}>
                <header>
                  <span className="resource-type">{formatLabel(resource.type)}</span>
                  {resource.source && <span className="resource-source">Nguồn: {resource.source}</span>}
                </header>
                {resource.type === 'image' && resource.url && (
                  <div className="resource-media">
                    <img src={resource.url} alt={resource.source ?? 'Tư liệu hình ảnh'} />
                  </div>
                )}
                {resource.type === 'video' && resource.url && (
                  <div className="resource-media video">
                    <iframe
                      src={resource.url}
                      title={resource.source ?? 'Tư liệu video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {resource.type === 'pdf' && resource.url && (
                  <a className="btn secondary" href={resource.url} target="_blank" rel="noreferrer">
                    Xem tài liệu PDF
                  </a>
                )}
                {resource.type === 'audio' && resource.url && (
                  <audio controls src={resource.url} />
                )}
                {resource.type === 'quote' && resource.content && <p>“{resource.content}”</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedCharacters.length > 0 && (
        <section className="related-section section">
          <div className="container">
            <header className="section-head">
              <p className="kicker">Liên quan</p>
              <h2>Nhân vật cùng thời hoặc cùng lĩnh vực</h2>
            </header>
            <div className="related-grid">
              {relatedCharacters.map((related) => (
                <article key={related.id} className="related-card">
                  <img src={related.image} alt={related.name} />
                  <div className="related-body">
                    <h3>{related.name}</h3>
                    <p>{related.title}</p>
                    <Link className="btn tertiary" to={`/nhan-vat/${related.id}`}>
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="timeline-overview section">
        <div className="container">
          <header className="section-head">
            <p className="kicker">Tổng quan cách mạng Việt Nam</p>
            <h2>Hành trình 4 giai đoạn lịch sử</h2>
          </header>
          <div className="overview-grid">
            <article className="overview-card">
              <h3>1930–1945</h3>
              <p>Thành lập Đảng Cộng sản Việt Nam, phong trào Xô viết Nghệ Tĩnh và Tổng khởi nghĩa.</p>
            </article>
            <article className="overview-card">
              <h3>1945–1975</h3>
              <p>Hai cuộc kháng chiến thần thánh chống thực dân Pháp và đế quốc Mỹ, thống nhất đất nước.</p>
            </article>
            <article className="overview-card">
              <h3>1975–1986</h3>
              <p>Xây dựng lại đất nước sau chiến tranh, bảo vệ biên giới và củng cố chế độ xã hội chủ nghĩa.</p>
            </article>
            <article className="overview-card">
              <h3>1986–nay</h3>
              <p>Đổi mới toàn diện, hội nhập quốc tế, phát triển kinh tế và nâng cao vị thế Việt Nam.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-layout">
          <div>
            <h2>Tự hào lịch sử – Bồi đắp tương lai</h2>
            <p>
              Hãy tiếp tục khám phá những câu chuyện truyền cảm hứng về con người Việt Nam kiệt xuất
              và lan tỏa tinh thần cách mạng đến cộng đồng.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="btn primary" to="/nhan-vat">
              Danh sách nhân vật
            </Link>
            <Link className="btn secondary" to="/">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CharacterDetailPage
