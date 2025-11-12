import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { characters } from '../data/characters'
import type { Character } from '../types'

const Book3DFlip = () => {
  const [currentPage, setCurrentPage] = useState(0) // 0 = cover
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward')
  const bookRef = useRef<HTMLDivElement>(null)
  const flippingPageRef = useRef<HTMLDivElement>(null)

  // Total pages: cover + characters + back cover
  const totalPages = characters.length + 2 // cover + 10 characters + back

  const getCurrentCharacter = (): Character | undefined => {
    if (currentPage === 0 || currentPage === totalPages - 1) {
      return undefined
    }
    return characters[currentPage - 1]
  }

  const character = getCurrentCharacter()

  // Page flip with curl effect
  const flipForward = () => {
    if (isFlipping || currentPage >= totalPages - 1) return

    setIsFlipping(true)
    setFlipDirection('forward')

    const flippingPage = flippingPageRef.current
    if (!flippingPage) {
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsFlipping(false)
      }, 100)
      return
    }

    // Get current and next page content
    const currentChar = getCurrentCharacter()
    const nextChar = currentPage === 0 ? characters[0] :
                     currentPage === totalPages - 2 ? undefined :
                     characters[currentPage]

    // Set flipping page content
    const leftContent = flippingPage.querySelector('.flipping-left') as HTMLElement
    const rightContent = flippingPage.querySelector('.flipping-right') as HTMLElement

    if (leftContent && rightContent) {
      // Left side shows current left content (will become back of flipping page)
      if (currentPage === 0) {
        leftContent.innerHTML = renderCoverLeftHTML()
      } else if (currentChar) {
        leftContent.innerHTML = renderCharacterLeftHTML(currentChar)
      }

      // Right side shows current right content (front of flipping page)
      if (currentPage === 0) {
        rightContent.innerHTML = renderCoverRightHTML()
      } else if (currentChar) {
        rightContent.innerHTML = renderCharacterRightHTML(currentChar)
      }
    }

    // GSAP animation for page curl
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage(prev => prev + 1)
        setIsFlipping(false)
      }
    })

    tl.set(flippingPage, {
      display: 'block',
      rotateY: 0
    })
    .to(flippingPage, {
      rotateY: -180,
      duration: 1.5,
      ease: 'power2.inOut'
    })
    .to(flippingPage, {
      display: 'none'
    })
  }

  const flipBackward = () => {
    if (isFlipping || currentPage <= 0) return

    setIsFlipping(true)
    setFlipDirection('backward')

    setTimeout(() => {
      setCurrentPage(prev => prev - 1)
      setIsFlipping(false)
    }, 1000)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipForward()
      if (e.key === 'ArrowLeft') flipBackward()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isFlipping])

  // Helper functions to render HTML content
  const renderCoverLeftHTML = () => `
    <div class="page-content-3d">
      <div class="cover-decoration"></div>
    </div>
  `

  const renderCoverRightHTML = () => `
    <div class="page-content-3d">
      <div class="cover-star-3d">⭐</div>
      <h1 class="cover-title-3d gradient-text">
        Dấu ấn<br />Người Cộng sản
      </h1>
      <div class="cover-subtitle-3d">
        <p>Hành trình của những con người</p>
        <p>làm nên lịch sử dân tộc</p>
      </div>
      <div class="cover-divider-3d"></div>
      <p class="cover-year-3d">${new Date().getFullYear()}</p>
    </div>
  `

  const renderCharacterLeftHTML = (char: Character) => `
    <div class="page-content-3d character-image-page">
      <div class="image-container-3d">
        <img src="${char.image}" alt="${char.name}" />
        <div class="image-overlay-3d"></div>
        <div class="image-label-3d">
          <h3 class="gradient-text">${char.name}</h3>
          <p>${char.personal_info.birth} - ${char.personal_info.death}</p>
        </div>
      </div>
    </div>
  `

  const renderCharacterRightHTML = (char: Character) => `
    <div class="page-content-3d character-info-page">
      <div class="character-info-card">
        <div class="info-header">
          <div class="info-badge">Thông tin chi tiết</div>
        </div>
        <div class="info-scroll-container">
          <div class="info-section-3d">
            <h4 class="info-title-3d">
              <span class="icon-3d">👤</span>
              Chức vụ
            </h4>
            <p class="info-text-3d">${char.title}</p>
          </div>
          <div class="info-section-3d">
            <h4 class="info-title-3d">
              <span class="icon-3d">📍</span>
              Thông tin
            </h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Quê quán:</span>
                <span class="value">${char.personal_info.hometown}</span>
              </div>
              <div class="info-item">
                <span class="label">Hoạt động:</span>
                <span class="value">${char.personal_info.active_period}</span>
              </div>
            </div>
          </div>
          <div class="info-section-3d">
            <h4 class="info-title-3d">
              <span class="icon-3d">🏆</span>
              Chiến công
            </h4>
            <ul class="achievements-list-3d">
              ${char.contributions.slice(0, 3).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `

  const renderCover = () => (
    <div className="book-spread-3d">
      <div className="page-3d left-page">
        <div className="page-content-3d">
          <div className="cover-decoration"></div>
        </div>
      </div>
      <div className="page-3d right-page" onClick={flipForward}>
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
    <div className="book-spread-3d">
      <div className="page-3d left-page" onClick={flipBackward}>
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
      <div className="page-3d right-page">
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

  const renderCharacterPage = (char: Character) => (
    <div className="book-spread-3d">
      <div className="page-3d left-page" onClick={flipBackward}>
        <div className="page-content-3d character-image-page">
          <div className="image-container-3d">
            <img src={char.image} alt={char.name} />
            <div className="image-overlay-3d"></div>
            <div className="image-label-3d">
              <h3 className="gradient-text">{char.name}</h3>
              <p>{char.personal_info.birth} - {char.personal_info.death}</p>
            </div>
          </div>
          <div className="click-hint">← Click để quay lại</div>
        </div>
      </div>
      <div className="page-3d right-page" onClick={flipForward}>
        <div className="page-content-3d character-info-page">
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
                <p className="info-text-3d">{char.title}</p>
              </div>

              <div className="info-section-3d">
                <h4 className="info-title-3d">
                  <span className="icon-3d">📍</span>
                  Thông tin
                </h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Quê quán:</span>
                    <span className="value">{char.personal_info.hometown}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Hoạt động:</span>
                    <span className="value">{char.personal_info.active_period}</span>
                  </div>
                </div>
              </div>

              <div className="info-section-3d">
                <h4 className="info-title-3d">
                  <span className="icon-3d">🏆</span>
                  Chiến công
                </h4>
                <ul className="achievements-list-3d">
                  {char.contributions.slice(0, 4).map((item, idx) => (
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
                  {char.timeline.slice(0, 3).map((event, idx) => (
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
                  "{char.thoughts[0]}"
                </blockquote>
              </div>
            </div>
          </div>

          {currentPage < totalPages - 1 && (
            <div className="click-hint">Click để lật trang →</div>
          )}
        </div>
      </div>
    </div>
  )

  // Calculate page stack sizes
  const leftPagesCount = currentPage
  const rightPagesCount = totalPages - currentPage - 1

  return (
    <div className="book-scene-3d">
      <div className="book-stage-3d">
        <motion.div
          ref={bookRef}
          className="book-3d"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Left page stack */}
          <div
            className="page-stack left-stack"
            style={{
              width: `${leftPagesCount * 0.3}rem`,
              display: leftPagesCount > 0 ? 'block' : 'none'
            }}
          >
            {[...Array(Math.min(leftPagesCount, 20))].map((_, i) => (
              <div
                key={i}
                className="stack-page"
                style={{
                  transform: `translateX(${-i * 0.5}px) translateZ(${-i * 2}px)`,
                  opacity: 1 - (i * 0.02)
                }}
              />
            ))}
          </div>

          {/* Book pages */}
          <div className="book-pages">
            {currentPage === 0 && renderCover()}
            {currentPage === totalPages - 1 && renderBackCover()}
            {character && renderCharacterPage(character)}

            {/* Flipping page with curl effect */}
            {isFlipping && (
              <div
                ref={flippingPageRef}
                className="flipping-page"
                style={{
                  transformOrigin: flipDirection === 'forward' ? 'right center' : 'left center'
                }}
              >
                <div className="flipping-left page-face"></div>
                <div className="flipping-right page-face"></div>
                <div className="page-curl-shadow"></div>
              </div>
            )}
          </div>

          {/* Right page stack */}
          <div
            className="page-stack right-stack"
            style={{
              width: `${rightPagesCount * 0.3}rem`,
              display: rightPagesCount > 0 ? 'block' : 'none'
            }}
          >
            {[...Array(Math.min(rightPagesCount, 20))].map((_, i) => (
              <div
                key={i}
                className="stack-page"
                style={{
                  transform: `translateX(${i * 0.5}px) translateZ(${-i * 2}px)`,
                  opacity: 1 - (i * 0.02)
                }}
              />
            ))}
          </div>

          {/* Book spine */}
          <div className="book-spine">
            <div className="spine-texture"></div>
            <div className="spine-line"></div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="book-controls-3d">
        <button
          className={`control-btn ${currentPage === 0 ? 'disabled' : ''}`}
          onClick={flipBackward}
          disabled={isFlipping || currentPage === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Quay lại</span>
        </button>

        <div className="page-indicator">
          <span className="current">{currentPage + 1}</span> / {totalPages}
        </div>

        <button
          className={`control-btn ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
          onClick={flipForward}
          disabled={isFlipping || currentPage === totalPages - 1}
        >
          <span>Tiếp theo</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="keyboard-hint-3d">
        <kbd>←</kbd> <kbd>→</kbd> để lật trang
      </div>
    </div>
  )
}

export default Book3DFlip
