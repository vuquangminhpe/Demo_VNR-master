import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Banner from '../components/Banner'
import Book3DFlip from '../components/Book3DFlip'

gsap.registerPlugin(ScrollTrigger)

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
}

const HomePage = () => {
  const lenisRef = useRef<Lenis | null>(null)

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

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <Banner />

      {/* Introduction Section */}
      <motion.section
        className="intro-section section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="section-head">
            <p className="kicker">Không gian lịch sử Việt Nam</p>
            <h1 className="gradient-text">"Dấu ấn Người Cộng sản"</h1>
            <p className="intro-description">
              Khám phá hành trình của những con người đã làm nên lịch sử dân tộc Việt Nam –
              những người cộng sản kiên trung, trí tuệ và tận hiến cho Tổ quốc.
              Lật từng trang sách để tìm hiểu về tiểu sử, chiến công và tư tưởng của các lãnh tụ.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 3D Book Viewer - Main Content */}
      <Book3DFlip />

      {/* Call to Action */}
      <motion.section
        className="cta-section section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="container">
          <div className="cta-content">
            <h2 className="gradient-text">Khám phá thêm</h2>
            <p>
              Đã xem qua các lãnh tụ tiêu biểu? Hãy khám phá danh sách đầy đủ để tìm hiểu
              chi tiết hơn về từng nhân vật và những đóng góp to lớn của họ cho dân tộc.
            </p>
            <a href="/nhan-vat" className="btn primary cta-btn">
              Xem danh sách đầy đủ
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage
