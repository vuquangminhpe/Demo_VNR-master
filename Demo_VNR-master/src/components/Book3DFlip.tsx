import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { characters } from '../data/characters'
import type { Character } from '../types'

const Book3DFlip = () => {
  const [currentSpread, setCurrentSpread] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const bookRef = useRef<HTMLDivElement>(null)

  // Total spreads: cover + character spreads (2 characters per spread) + back cover
  const totalSpreads = Math.ceil(characters.length / 2) + 2

  const getCurrentCharacters = (): [Character?, Character?] => {
    if (currentSpread === 0 || currentSpread === totalSpreads - 1) {
      return [undefined, undefined]
    }
    const startIdx = (currentSpread - 1) * 2
    return [characters[startIdx], characters[startIdx + 1]]
  }

  const [leftChar, rightChar] = getCurrentCharacters()

  const flipPageForward = () => {
    if (isFlipping || currentSpread >= totalSpreads - 1) return

    setIsFlipping(true)

    // Immediately update state to show next spread
    setTimeout(() => {
      setCurrentSpread(prev => prev + 1)
      setIsFlipping(false)
    }, 800)
  }

  const flipPageBackward = () => {
    if (isFlipping || currentSpread <= 0) return

    setIsFlipping(true)

    setTimeout(() => {
      setCurrentSpread(prev => prev - 1)
      setIsFlipping(false)
    }, 800)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipPageForward()
      if (e.key === 'ArrowLeft') flipPageBackward()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSpread, isFlipping])

  // 3D tilt on mouse move
  useEffect(() => {
    const book = bookRef.current
    if (!book) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isFlipping) return

      const rect = book.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height

      gsap.to(book, {
        rotationY: x * 5,
        rotationX: -y * 5,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(book, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5
      })
    }

    book.addEventListener('mousemove', handleMouseMove)
    book.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      book.removeEventListener('mousemove', handleMouseMove)
      book.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isFlipping])

  const renderCover = () => (
    <div className="book-spread-3d cover-spread-3d">
      <div className="page-3d left-cover-3d">
        <div className="page-content-3d">
          <div className="cover-decoration"></div>
        </div>
      </div>
      <div className="page-3d right-cover-3d" onClick={flipPageForward}>
        <div className="page-content-3d">
          <div className="cover-star-3d">⭐</div>
          <h1 className="cover-title-3d gradient-text">
            Dấu ấn<br />Người Cộng sản
          </h1>
          <div className="cover-subtitle-3d">
            <p>Hành trình của những con người</p>
            <p>làm nên lịch sử dân tộc</p>
          </div>
          <div className="cover-divider-3d"></div>
          <p className="cover-year-3d">{new Date().getFullYear()}</p>
          <div className="click-hint">Click để mở sách →</div>
        </div>
      </div>
    </div>
  )

  const renderBackCover = () => (
    <div className="book-spread-3d back-spread-3d">
      <div className="page-3d left-back-3d" onClick={flipPageBackward}>
        <div className="page-content-3d">
          <div className="back-quote-3d">
            "Không có gì quý hơn<br />độc lập, tự do"
          </div>
          <div className="back-divider-3d"></div>
          <p className="back-text-3d">
            {characters.length} chân dung lãnh tụ<br />
            và nhà cách mạng kiên trung
          </p>
          <div className="click-hint">← Click để quay lại</div>
        </div>
      </div>
      <div className="page-3d right-back-3d">
        <div className="page-content-3d">
          <div className="back-logo-3d">
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L6 10v12l10 8 10-8V10L16 2z"
                fill="url(#back-gradient)"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M16 12l-4 3v5l4 3 4-3v-5l-4-3z"
                fill="var(--color-gold-primary)"
              />
              <defs>
                <linearGradient id="back-gradient" x1="6" y1="2" x2="26" y2="30">
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

  const renderCharacterSpread = (left?: Character, right?: Character) => (
    <div className="book-spread-3d character-spread-3d">
      {/* Left Page - First Character Image */}
      <div className="page-3d left-page-3d" onClick={flipPageBackward}>
        {left ? (
          <div className="page-content-3d character-image-page">
            <div className="image-container-3d">
              <img src={left.image} alt={left.name} />
              <div className="image-overlay-3d"></div>
              <div className="image-label-3d">
                <h3 className="gradient-text">{left.name}</h3>
                <p>{left.personal_info.birth} - {left.personal_info.death}</p>
              </div>
            </div>
            <div className="click-hint">← Click để quay lại</div>
          </div>
        ) : null}
      </div>

      {/* Right Page - First Character Info + Second Character */}
      <div className="page-3d right-page-3d" onClick={flipPageForward}>
        <div className="page-content-3d character-info-page">
          {left && (
            <div className="character-info-card">
              <div className="info-header">
                <div className="info-badge">Thông tin chi tiết</div>
              </div>

              <div className="info-scroll-container">
                <div className="info-section-3d">
                  <h4 className="info-title-3d">
                    <span className="icon-3d">👤</span>
                    Chức vụ
                  </h4>
                  <p className="info-text-3d">{left.title}</p>
                </div>

                <div className="info-section-3d">
                  <h4 className="info-title-3d">
                    <span className="icon-3d">📍</span>
                    Thông tin
                  </h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Quê quán:</span>
                      <span className="value">{left.personal_info.hometown}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Hoạt động:</span>
                      <span className="value">{left.personal_info.active_period}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section-3d">
                  <h4 className="info-title-3d">
                    <span className="icon-3d">🏆</span>
                    Chiến công
                  </h4>
                  <ul className="achievements-list-3d">
                    {left.contributions.slice(0, 4).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-section-3d">
                  <h4 className="info-title-3d">
                    <span className="icon-3d">📜</span>
                    Dấu mốc lịch sử
                  </h4>
                  <div className="timeline-3d">
                    {left.timeline.slice(0, 4).map((event, idx) => (
                      <div key={idx} className="timeline-item-3d">
                        <div className="timeline-year-3d">{event.year}</div>
                        <div className="timeline-event-3d">{event.event}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-section-3d quote-section-3d">
                  <h4 className="info-title-3d">
                    <span className="icon-3d">💬</span>
                    Câu nói bất hủ
                  </h4>
                  <blockquote className="quote-3d">
                    "{left.thoughts[0]}"
                  </blockquote>
                </div>

                {right && (
                  <>
                    <div className="divider-3d"></div>

                    <div className="next-character-preview">
                      <p className="preview-label">Tiếp theo:</p>
                      <div className="preview-card">
                        <img src={right.image} alt={right.name} />
                        <div className="preview-info">
                          <h5 className="gradient-text">{right.name}</h5>
                          <p>{right.title}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {currentSpread < totalSpreads - 1 && (
            <div className="click-hint">Click để lật trang →</div>
          )}
        </div>
      </div>
    </div>
  )

  // Page flip animation variants
  const pageVariants = {
    initial: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.8
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  }

  return (
    <div className="book-scene-3d">
      <div className="book-stage">
        <motion.div
          ref={bookRef}
          className={`book-container-3d ${isFlipping ? 'flipping' : ''}`}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Current spread with page flip animation */}
          <AnimatePresence mode="wait" custom={isFlipping ? 1 : -1}>
            <motion.div
              key={currentSpread}
              custom={isFlipping ? 1 : -1}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="current-spread"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {currentSpread === 0 && renderCover()}
              {currentSpread === totalSpreads - 1 && renderBackCover()}
              {currentSpread > 0 && currentSpread < totalSpreads - 1 && renderCharacterSpread(leftChar, rightChar)}
            </motion.div>
          </AnimatePresence>

          {/* Book spine */}
          <div className="book-spine-3d"></div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="book-controls-3d">
        <button
          className={`control-btn prev-control ${currentSpread === 0 ? 'disabled' : ''}`}
          onClick={flipPageBackward}
          disabled={isFlipping || currentSpread === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Quay lại</span>
        </button>

        <div className="spread-indicator">
          <div className="indicator-text">
            Trang <span className="current">{currentSpread + 1}</span> / {totalSpreads}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
            ></div>
          </div>
        </div>

        <button
          className={`control-btn next-control ${currentSpread === totalSpreads - 1 ? 'disabled' : ''}`}
          onClick={flipPageForward}
          disabled={isFlipping || currentSpread === totalSpreads - 1}
        >
          <span>Tiếp theo</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="keyboard-hint-3d">
        <kbd>←</kbd> <kbd>→</kbd> để lật trang
      </div>
    </div>
  )
}

export default Book3DFlip
