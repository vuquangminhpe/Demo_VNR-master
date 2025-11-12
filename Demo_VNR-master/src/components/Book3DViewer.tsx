import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { characters } from '../data/characters'
import type { Character } from '../types'

const Book3DViewer = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const bookRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Total pages: cover + character pages + back cover
  const totalPages = characters.length + 2
  const currentCharacter = currentPage > 0 && currentPage < totalPages - 1
    ? characters[currentPage - 1]
    : null

  // Page flip sound effect (using data URL for inline audio)
  useEffect(() => {
    // Create a simple page flip sound effect
    audioRef.current = new Audio()
  }, [])

  const playFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  const handleNextPage = () => {
    if (isFlipping || currentPage >= totalPages - 1) return
    setDirection('next')
    setIsFlipping(true)
    playFlipSound()

    setTimeout(() => {
      setCurrentPage((prev) => prev + 1)
      setIsFlipping(false)
    }, 800)
  }

  const handlePrevPage = () => {
    if (isFlipping || currentPage <= 0) return
    setDirection('prev')
    setIsFlipping(true)
    playFlipSound()

    setTimeout(() => {
      setCurrentPage((prev) => prev - 1)
      setIsFlipping(false)
    }, 800)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage()
      if (e.key === 'ArrowLeft') handlePrevPage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isFlipping])

  // 3D book tilt effect on mouse move
  useEffect(() => {
    const book = bookRef.current
    if (!book) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = book.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      const rotateX = (y / rect.height) * -5
      const rotateY = (x / rect.width) * 5

      gsap.to(book, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(book, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5
      })
    }

    book.addEventListener('mousemove', handleMouseMove)
    book.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      book.removeEventListener('mousemove', handleMouseMove)
      book.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const renderCover = () => (
    <div className="book-spread cover-spread">
      <div className="book-page book-cover">
        <div className="cover-content">
          <div className="cover-star">⭐</div>
          <h1 className="cover-title gradient-text">
            Dấu ấn<br />Người Cộng sản
          </h1>
          <div className="cover-subtitle">
            <p>Hành trình của những con người</p>
            <p>làm nên lịch sử dân tộc</p>
          </div>
          <div className="cover-divider"></div>
          <p className="cover-year">{new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )

  const renderBackCover = () => (
    <div className="book-spread back-cover-spread">
      <div className="book-page book-back-cover">
        <div className="back-cover-content">
          <div className="back-quote">
            "Không có gì quý hơn<br />độc lập, tự do"
          </div>
          <div className="back-divider"></div>
          <p className="back-text">
            {characters.length} chân dung lãnh tụ<br />
            và nhà cách mạng kiên trung
          </p>
          <div className="back-logo">
            <svg width="60" height="60" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L6 10v12l10 8 10-8V10L16 2z"
                fill="url(#back-logo-gradient)"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M16 12l-4 3v5l4 3 4-3v-5l-4-3z"
                fill="var(--color-gold-primary)"
              />
              <defs>
                <linearGradient id="back-logo-gradient" x1="6" y1="2" x2="26" y2="30">
                  <stop offset="0%" stopColor="var(--color-red-primary)" />
                  <stop offset="100%" stopColor="var(--color-red-dark)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCharacterPage = (character: Character) => (
    <div className="book-spread character-spread">
      {/* Left Page - Image */}
      <div className="book-page left-page">
        <div className="page-number">{currentPage * 2 - 1}</div>
        <div className="character-image-container">
          <div className="image-frame">
            <img src={character.image} alt={character.name} />
            <div className="image-overlay"></div>
          </div>
          <div className="character-name-label">
            <h2 className="gradient-text">{character.name}</h2>
            <p className="character-years">
              {character.personal_info.birth} - {character.personal_info.death}
            </p>
          </div>
        </div>
      </div>

      {/* Right Page - Info */}
      <div className="book-page right-page">
        <div className="page-number">{currentPage * 2}</div>
        <div className="character-info-container">
          <div className="info-section">
            <h3 className="info-title">
              <span className="icon">👤</span>
              Chức vụ
            </h3>
            <p className="info-content">{character.title}</p>
          </div>

          <div className="info-section">
            <h3 className="info-title">
              <span className="icon">🏆</span>
              Chiến công tiêu biểu
            </h3>
            <ul className="achievements-list">
              {character.contributions.slice(0, 3).map((contribution, idx) => (
                <li key={idx}>{contribution}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h3 className="info-title">
              <span className="icon">📜</span>
              Dấu mốc lịch sử
            </h3>
            <div className="timeline-mini">
              {character.timeline.slice(0, 3).map((event, idx) => (
                <div key={idx} className="timeline-item-mini">
                  <span className="timeline-year">{event.year}</span>
                  <span className="timeline-event">{event.event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section quote-section">
            <h3 className="info-title">
              <span className="icon">💬</span>
              Câu nói bất hủ
            </h3>
            <blockquote className="character-quote">
              "{character.thoughts[0]}"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="book-viewer-container">
      <div className="book-scene">
        <motion.div
          ref={bookRef}
          className={`book-3d ${isFlipping ? 'flipping' : ''} ${direction}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="book-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentPage === 0 && renderCover()}
              {currentPage === totalPages - 1 && renderBackCover()}
              {currentCharacter && renderCharacterPage(currentCharacter)}
            </motion.div>
          </AnimatePresence>

          {/* Book Spine Shadow */}
          <div className="book-spine-shadow"></div>
        </motion.div>

        {/* Navigation */}
        <div className="book-navigation">
          <button
            className={`nav-btn prev-btn ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={isFlipping || currentPage === 0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Trang trước</span>
          </button>

          <div className="page-indicator">
            <span className="current-page">{currentPage + 1}</span>
            <span className="page-divider">/</span>
            <span className="total-pages">{totalPages}</span>
          </div>

          <button
            className={`nav-btn next-btn ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={isFlipping || currentPage === totalPages - 1}
          >
            <span>Trang sau</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="keyboard-hint">
          <span>← →</span> để lật trang
        </div>
      </div>
    </div>
  )
}

export default Book3DViewer
