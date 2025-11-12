import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Banner from '../components/Banner'
import { characters } from '../data/characters'
import type { Character } from '../types'

gsap.registerPlugin(ScrollTrigger)

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

// Animation variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
  }
}

const HomePage = () => {
  const lenisRef = useRef<Lenis | null>(null)
  const introRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // GSAP ScrollTrigger animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stat numbers
      const statNumbers = statsRef.current?.querySelectorAll('.stat-number')
      statNumbers?.forEach((stat) => {
        const target = stat.textContent?.replace('+', '').replace('%', '') || '0'
        const isPercentage = stat.textContent?.includes('%')
        const hasPlus = stat.textContent?.includes('+')

        gsap.from(stat, {
          textContent: 0,
          duration: 2,
          ease: 'power1.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            once: true
          },
          onUpdate: function() {
            const value = Math.ceil(parseFloat(this.targets()[0].textContent))
            this.targets()[0].textContent = value + (isPercentage ? '%' : hasPlus ? '+' : '')
          }
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const IntroSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
      <motion.section
        ref={ref}
        className="intro-section section"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="container intro-layout">
          <motion.div className="intro-text" variants={fadeInUp}>
            <p className="kicker">Không gian lịch sử Việt Nam</p>
            <h1 className="gradient-text">"Dấu ấn Người Cộng sản"</h1>
            <p className="intro-description">
              Nơi lưu giữ hành trình của những con người đã làm nên lịch sử dân tộc Việt Nam –
              những người cộng sản kiên trung, trí tuệ và tận hiến cho Tổ quốc. Hãy cùng khám phá
              tinh thần cách mạng và những giá trị trường tồn của dân tộc.
            </p>
            <div className="intro-actions">
              <Link className="btn primary" to="/nhan-vat">
                Khám phá nhân vật
              </Link>
              <a className="btn secondary" href="#featured-events">
                Sự kiện tiêu biểu
              </a>
            </div>
          </motion.div>

          <motion.div ref={statsRef} className="intro-stats" variants={staggerContainer}>
            {[
              { number: characters.length, suffix: '+', label: 'Chân dung lãnh tụ và nhà cách mạng' },
              { number: 4, suffix: '', label: 'Giai đoạn lịch sử trọng yếu' },
              { number: 100, suffix: '%', label: 'Tư liệu được kiểm chứng' }
            ].map((stat, index) => (
              <motion.div key={index} className="stat-card glass" variants={scaleIn}>
                <span className="stat-number gradient-text">
                  {stat.number}{stat.suffix}
                </span>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    )
  }

  const WeeklyCharacter = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    if (!weeklyCharacter) return null

    return (
      <motion.section
        ref={ref}
        className="weekly-highlight section"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeInUp}
      >
        <div className="container">
          <motion.div className="weekly-card glass">
            <motion.div
              className="weekly-media"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <img src={weeklyCharacter.image} alt={weeklyCharacter.name} />
              <div className="weekly-badge">Nhân vật trong tuần</div>
            </motion.div>
            <div className="weekly-content">
              <p className="kicker">Nhân vật trong tuần</p>
              <h2 className="gradient-text">{weeklyCharacter.name}</h2>
              <p className="weekly-title">{weeklyCharacter.title}</p>
              <p className="weekly-quote">"{highlightedQuote}"</p>
              <div className="weekly-meta">
                <div className="meta-item">
                  <span className="meta-label">Thời kỳ hoạt động</span>
                  <span className="meta-value">{weeklyCharacter.personal_info.active_period}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Quê quán</span>
                  <span className="meta-value">{weeklyCharacter.personal_info.hometown}</span>
                </div>
              </div>
              <Link className="btn primary" to={`/nhan-vat/${weeklyCharacter.id}`}>
                Xem chi tiết
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    )
  }

  const FeaturedEvents = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    return (
      <motion.section
        ref={ref}
        id="featured-events"
        className="featured-events section"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-head" variants={fadeInUp}>
            <p className="kicker">Sự kiện tiêu biểu</p>
            <h2 className="gradient-text">Những dấu mốc làm nên lịch sử</h2>
          </motion.div>

          <div className="event-groups">
            {groupEventsByPhase().map(([phase, events]) => (
              <motion.div key={phase} className="event-group" variants={fadeInUp}>
                <h3 className="phase-title">{phase}</h3>
                <div className="event-grid">
                  {events.map((event, index) => (
                    <motion.article
                      key={event.title}
                      className="event-card glass"
                      variants={scaleIn}
                      whileHover={{
                        y: -12,
                        transition: { duration: 0.3 }
                      }}
                      custom={index}
                    >
                      <div className="event-thumb">
                        <img src={event.image} alt={event.title} />
                        <div className="event-overlay"></div>
                      </div>
                      <div className="event-body">
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                        <a className="event-link" href={event.link} target="_blank" rel="noreferrer">
                          Tìm hiểu thêm
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3 8h10M9 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  return (
    <div className="home-page">
      <Banner />
      <IntroSection />
      <WeeklyCharacter />
      <FeaturedEvents />
    </div>
  )
}

export default HomePage
