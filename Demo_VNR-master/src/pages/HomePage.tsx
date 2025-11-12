import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Banner from '../components/Banner'
import { characters } from '../data/characters'
import type { Character } from '../types'

const featuredEvents = [
  {
    phase: '1930–1945',
    title: '1945 – Cách mạng Tháng Tám thành công',
    image: 'https://cdnimg.vietnamplus.vn/t1200/Uploaded/lce_jwqqc/2024_08_19/cachmangthangtam-2300.jpg',
    description:
      'Khởi đầu kỷ nguyên độc lập dân tộc, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    link: 'https://vi.wikipedia.org/wiki/C%C3%A1ch_m%E1%BA%A1ng_Th%C3%A1ng_T%C3%A1m'
  },
  {
    phase: '1945–1975',
    title: '1954 – Chiến thắng Điện Biên Phủ',
    image: 'https://media.vov.vn/sites/default/files/styles/large/public/2024-05/dien-bien-phu-1954.jpg',
    description: 'Chiến thắng lừng lẫy năm châu, chấn động địa cầu, kết thúc chiến tranh Đông Dương.',
    link: 'https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_d%E1%BB%8Bch_%C4%90i%E1%BB%87n_Bi%C3%AAn_Ph%E1%BB%A7'
  },
  {
    phase: '1945–1975',
    title: '1975 – Đại thắng mùa Xuân',
    image: 'https://vtv1.mediacdn.vn/thumb_w/640/2018/5/16/1975-1526452551297271656397.jpg',
    description: 'Giải phóng miền Nam, thống nhất đất nước, mở ra thời kỳ xây dựng Tổ quốc.',
    link: 'https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_d%E1%BB%8Bch_H%E1%BB%93_Ch%C3%AD_Minh'
  },
  {
    phase: '1975–1986',
    title: '1979 – Bảo vệ biên giới phía Bắc',
    image: 'https://photo-cms-plo.zadn.vn/w850/Uploaded/2024/otn-llw/2022_02_18/chientranbiengioi1979.jpg',
    description: 'Kiên cường bảo vệ từng tấc đất thiêng liêng của Tổ quốc sau ngày thống nhất.',
    link: 'https://vi.wikipedia.org/wiki/Chi%E1%BA%BFn_tranh_bi%C3%AAn_gi%E1%BB%9Bi_Vi%E1%BB%87t_Nam%E2%80%93Trung_1979'
  },
  {
    phase: '1986–nay',
    title: '1986 – Công cuộc Đổi mới',
    image: 'https://media.vietq.vn/files/news/canh-hung/2022/08/28/dai-hoi-vi-dang.jpg',
    description: 'Đổi mới tư duy chiến lược, đưa Việt Nam bước vào thời kỳ hội nhập và phát triển.',
    link: 'https://vi.wikipedia.org/wiki/%C4%90%E1%BB%95i_m%E1%BB%9Bi_(Vi%E1%BB%87t_Nam)'
  },
  {
    phase: '1986–nay',
    title: '2007 – Việt Nam gia nhập WTO',
    image: 'https://cdn.vietnambiz.vn/2020/7/15/wto-15948013117871520696317.jpg',
    description: 'Dấu mốc hội nhập toàn cầu, khẳng định vị thế Việt Nam trên trường quốc tế.',
    link: 'https://vi.wikipedia.org/wiki/T%E1%BB%95_ch%E1%BB%A9c_Th%C6%B0%C6%A1ng_m%E1%BA%A1i_Th%E1%BA%BF_gi%E1%BB%9Bi'
  }
]

const computeWeekIndex = (characterList: Character[]) => {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - startOfYear.getTime()
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
  return week % characterList.length
}

type FeaturedEvent = (typeof featuredEvents)[number]

const groupEventsByPhase = () => {
  const phaseMap = new Map<string, FeaturedEvent[]>()
  featuredEvents.forEach((event) => {
    if (!phaseMap.has(event.phase)) {
      phaseMap.set(event.phase, [])
    }
    phaseMap.get(event.phase)?.push(event)
  })
  return Array.from(phaseMap.entries())
}

const HomePage = () => {
  const weeklyCharacter = useMemo(() => {
    if (characters.length === 0) return undefined
    const index = computeWeekIndex(characters)
    return characters[index]
  }, [])

  const highlightedQuote = useMemo(() => {
    if (!weeklyCharacter) return undefined
    const quoteResource = weeklyCharacter.resources.find((item) => item.type === 'quote')
    if (quoteResource?.content) return quoteResource.content
    return weeklyCharacter.thoughts[0]
  }, [weeklyCharacter])

  return (
    <div className="home-page">
      <Banner />

      <section className="intro-section">
        <div className="container intro-layout">
          <div className="intro-text">
            <p className="kicker">Không gian lịch sử Việt Nam</p>
            <h1>"Dấu ấn Người Cộng sản"</h1>
            <p>
              Nơi lưu giữ hành trình của những con người đã làm nên lịch sử dân tộc Việt Nam –
              những người cộng sản kiên trung, trí tuệ và tận hiến cho Tổ quốc. Hãy cùng khám phá
              tinh thần cách mạng và những giá trị trường tồn của dân tộc.
            </p>
            <div className="intro-actions">
              <Link className="btn primary" to="/nhan-vat">
                Khám phá nhân vật
              </Link>
              <a className="btn ghost" href="#featured-events">
                Sự kiện tiêu biểu
              </a>
            </div>
          </div>
          <div className="intro-stats">
            <div className="stat-card">
              <span className="stat-number">{characters.length}+</span>
              <p>Chân dung lãnh tụ và nhà cách mạng</p>
            </div>
            <div className="stat-card">
              <span className="stat-number">4</span>
              <p>Giai đoạn lịch sử trọng yếu</p>
            </div>
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <p>Tư liệu được kiểm chứng</p>
            </div>
          </div>
        </div>
      </section>

      {weeklyCharacter && (
        <section className="weekly-highlight">
          <div className="container weekly-card">
            <div className="weekly-media">
              <img src={weeklyCharacter.image} alt={weeklyCharacter.name} />
            </div>
            <div className="weekly-content">
              <p className="kicker">Nhân vật trong tuần</p>
              <h2>{weeklyCharacter.name}</h2>
              <p className="weekly-title">{weeklyCharacter.title}</p>
              <p className="weekly-quote">“{highlightedQuote}”</p>
              <div className="weekly-meta">
                <span>
                  <strong>Thời kỳ hoạt động:</strong> {weeklyCharacter.personal_info.active_period}
                </span>
                <span>
                  <strong>Quê quán:</strong> {weeklyCharacter.personal_info.hometown}
                </span>
              </div>
              <Link className="btn secondary" to={`/nhan-vat/${weeklyCharacter.id}`}>
                Xem chi tiết
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="featured-events" className="featured-events">
        <div className="container">
          <p className="kicker">Sự kiện tiêu biểu</p>
          <h2>Những dấu mốc làm nên lịch sử</h2>
          <div className="event-groups">
            {groupEventsByPhase().map(([phase, events]) => (
              <div className="event-group" key={phase}>
                <h3>{phase}</h3>
                <div className="event-grid">
                  {events.map((event) => (
                    <article className="event-card" key={event.title}>
                      <div className="event-thumb">
                        <img src={event.image} alt={event.title} />
                      </div>
                      <div className="event-body">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <a className="event-link" href={event.link} target="_blank" rel="noreferrer">
                          Tìm hiểu thêm →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
