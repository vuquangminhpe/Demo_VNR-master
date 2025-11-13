/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { characters } from "../data/characters";
import type { Character } from "../types";
import LOGO from "../../public/image.png";

const Book3DFlip = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [, setFlipDirection] = useState<"forward" | "backward">("forward");
  const bookRef = useRef<HTMLDivElement>(null);
  const forwardCurlRef = useRef<HTMLDivElement>(null);

  const totalPages = characters.length + 2;

  const getCurrentCharacter = (): Character | undefined => {
    if (currentPage === 0 || currentPage === totalPages - 1) {
      return undefined;
    }
    return characters[currentPage - 1];
  };

  const getNextCharacter = (): Character | undefined => {
    const nextPage = currentPage + 1;
    if (nextPage === 0 || nextPage === totalPages - 1) {
      return undefined;
    }
    return characters[nextPage - 1];
  };

  const character = getCurrentCharacter();
  const nextCharacter = getNextCharacter();

  // Forward page flip (right page curls left)
  const flipForward = () => {
    if (isFlipping || currentPage >= totalPages - 1) return;

    setIsFlipping(true);
    setFlipDirection("forward");
    const curlPage = forwardCurlRef.current;

    if (!curlPage) {
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 100);
      return;
    }

    // Add current page class for animation
    curlPage.classList.add("animating-forward");
    gsap.set(curlPage, { display: "block", opacity: 1 });

    // Realistic curl animation with multiple phases
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev + 1);
        gsap.set(curlPage, { display: "none", opacity: 0 });
        curlPage.classList.remove("animating-forward");
        setIsFlipping(false);
      },
    });

    // Phase 1: Initial lift (0-20%)
    tl.to(curlPage, {
      "--curl-progress": "0.2",
      duration: 0.25,
      ease: "power1.in",
    })
      // Phase 2: Main curl (20-80%)
      .to(curlPage, {
        "--curl-progress": "0.8",
        duration: 0.7,
        ease: "power2.inOut",
      })
      // Phase 3: Complete flip (80-100%)
      .to(curlPage, {
        "--curl-progress": "1",
        duration: 0.25,
        ease: "power1.out",
      });
  };

  // Backward page flip (right page curls right - going back)
  const flipBackward = () => {
    if (isFlipping || currentPage <= 0) return;

    setIsFlipping(true);
    setFlipDirection("backward");
    const curlPage = forwardCurlRef.current; // Use forwardCurlRef because we're curling the RIGHT page

    if (!curlPage) {
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 100);
      return;
    }

    // Add current page class for animation
    curlPage.classList.add("animating-backward");
    gsap.set(curlPage, { display: "block", opacity: 1 });

    // Realistic curl animation with multiple phases (reverse direction)
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentPage((prev) => prev - 1);
        gsap.set(curlPage, { display: "none", opacity: 0 });
        curlPage.classList.remove("animating-backward");
        setIsFlipping(false);
      },
    });

    // Phase 1: Initial lift (0-20%)
    tl.to(curlPage, {
      "--curl-progress": "0.2",
      duration: 0.25,
      ease: "power1.in",
    })
      // Phase 2: Main curl (20-80%)
      .to(curlPage, {
        "--curl-progress": "0.8",
        duration: 0.7,
        ease: "power2.inOut",
      })
      // Phase 3: Complete flip (80-100%)
      .to(curlPage, {
        "--curl-progress": "1",
        duration: 0.25,
        ease: "power1.out",
      });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipForward();
      if (e.key === "ArrowLeft") flipBackward();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, isFlipping]);

  const renderCover = () => (
    <div className="book-spread">
      <div className="book-page left-page cover-left">
        <div className="page-surface">
          <div className="page-content">
            <div className="cover-decoration"></div>
          </div>
        </div>
        <div className="page-edge left-edge"></div>
      </div>
      <div className="book-page right-page cover-right" onClick={flipForward}>
        <div className="page-surface">
          <div className="page-content">
            <div className="cover-star">⭐</div>
            <h1 className="cover-title gradient-text">
              Dấu ấn
              <br />
              Người Cộng sản
            </h1>
            <div className="cover-subtitle">
              <p>Hành trình của những con người</p>
              <p>làm nên lịch sử dân tộc</p>
            </div>
            <div className="cover-divider"></div>
            <p className="cover-year">{new Date().getFullYear()}</p>
            <div className="click-hint">Click để mở sách →</div>
          </div>
        </div>
        <div className="page-edge right-edge"></div>
      </div>
    </div>
  );

  const renderBackCover = () => (
    <div className="book-spread">
      <div className="book-page left-page back-left" onClick={flipBackward}>
        <div className="page-surface">
          <div className="page-content">
            <div className="back-quote">
              "Không có gì quý hơn
              <br />
              độc lập, tự do"
            </div>
            <div className="back-divider"></div>
            <p className="back-text">
              {characters.length} chân dung lãnh tụ
              <br />
              và nhà cách mạng kiên trung
            </p>
            <div className="click-hint">← Click để quay lại</div>
          </div>
        </div>
        <div className="page-edge left-edge"></div>
      </div>
      <div className="book-page right-page back-right">
        <div className="page-surface">
          <div className="page-content">
            <div className="back-logo">
              <img
                src={LOGO}
                alt=""
                style={{
                  width: "500px",
                  height: "500px",
                  borderRadius: "10%",
                }}
              />
            </div>
          </div>
        </div>
        <div className="page-edge right-edge"></div>
      </div>
    </div>
  );

  const renderCharacterPage = (char: Character) => (
    <div className="book-spread">
      <div
        className="book-page left-page"
        onClick={currentPage > 1 ? flipBackward : undefined}
        style={{ cursor: currentPage > 1 ? "pointer" : "default" }}
      >
        <div className="page-surface">
          <div className="page-content character-image-page">
            <div className="image-container">
              <img src={char.image} alt={char.name} />
              <div className="image-overlay"></div>
              <div className="image-label">
                <h3 className="gradient-text">{char.name}</h3>
                <p>
                  {char.personal_info.birth} - {char.personal_info.death}
                </p>
              </div>
            </div>
            {currentPage > 1 && (
              <div className="click-hint">← Click để quay lại</div>
            )}
          </div>
        </div>
        <div className="page-edge left-edge"></div>
      </div>
      <div
        className="book-page right-page"
        onClick={currentPage < totalPages - 1 ? flipForward : undefined}
        style={{ cursor: currentPage < totalPages - 1 ? "pointer" : "default" }}
      >
        <div className="page-surface">
          <div className="page-content character-info-page">
            <div className="character-info-card">
              <div className="info-header">
                <div className="info-badge">Thông tin chi tiết</div>
              </div>

              <div className="info-scroll">
                <div className="info-section">
                  <h4 className="info-title">
                    <span className="icon">👤</span>
                    Chức vụ
                  </h4>
                  <p className="info-text">{char.title}</p>
                </div>

                <div className="info-section">
                  <h4 className="info-title">
                    <span className="icon">📍</span>
                    Thông tin
                  </h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Quê quán:</span>
                      <span className="value">
                        {char.personal_info.hometown}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Hoạt động:</span>
                      <span className="value">
                        {char.personal_info.active_period}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4 className="info-title">
                    <span className="icon">🏆</span>
                    Chiến công
                  </h4>
                  <ul className="achievements-list">
                    {char.contributions.slice(0, 4).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-section">
                  <h4 className="info-title">
                    <span className="icon">📜</span>
                    Dấu mốc lịch sử
                  </h4>
                  <div className="timeline">
                    {char.timeline.slice(0, 3).map((event, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-year">{event.year}</div>
                        <div className="timeline-event">{event.event}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-section quote-section">
                  <h4 className="info-title">
                    <span className="icon">💬</span>
                    Câu nói bất hủ
                  </h4>
                  <blockquote className="quote">
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
        <div className="page-edge right-edge"></div>
      </div>
    </div>
  );

  const leftPagesCount = currentPage;
  const rightPagesCount = totalPages - currentPage - 1;

  return (
    <div className="book-scene">
      <div className="book-stage">
        <motion.div
          ref={bookRef}
          className="thick-book"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Page thickness visualization */}
          <div className="book-thickness">
            {/* Left pages stack */}
            <div
              className="pages-left"
              style={{
                width: `${leftPagesCount * 5}px`,
                display: leftPagesCount > 0 ? "block" : "none",
              }}
            >
              {[...Array(Math.min(leftPagesCount, 20))].map((_, i) => (
                <div
                  key={i}
                  className="page-layer"
                  style={{
                    left: `${-i * 0.25}px`,
                    transform: `translateZ(${-i * 2}px)`,
                    opacity: 1 - i * 0.02,
                  }}
                />
              ))}
            </div>

            {/* Book spine */}
            <div className="book-spine">
              <div className="spine-texture"></div>
              <div className="spine-line"></div>
              <div className="spine-shadow"></div>
            </div>

            {/* Right pages stack */}
            <div
              className="pages-right"
              style={{
                width: `${rightPagesCount * 5}px`,
                display: rightPagesCount > 0 ? "block" : "none",
              }}
            >
              {[...Array(Math.min(rightPagesCount, 20))].map((_, i) => (
                <div
                  key={i}
                  className="page-layer"
                  style={{
                    right: `${-i * 0.25}px`,
                    transform: `translateZ(${-i * 2}px)`,
                    opacity: 1 - i * 0.02,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main book content */}
          <div className="book-content">
            {currentPage === 0 && renderCover()}
            {currentPage === totalPages - 1 && renderBackCover()}
            {character && renderCharacterPage(character)}

            {/* Forward curling page (right page curls left) */}
            <div
              ref={forwardCurlRef}
              className="curling-page forward-curl"
              style={{
                display: "none",
                // @ts-ignore
                "--curl-progress": "0",
              }}
            >
              <div className="curl-container">
                <div className="curl-shadow"></div>
                <div className="curl-page-wrapper">
                  <div className="curl-front">
                    {/* Content of the current right page */}
                    {currentPage === 0 && (
                      <div className="page-content">
                        <div className="cover-star">⭐</div>
                        <h1 className="cover-title gradient-text">
                          Dấu ấn
                          <br />
                          Người Cộng sản
                        </h1>
                        <div className="cover-subtitle">
                          <p>Hành trình của những con người</p>
                          <p>làm nên lịch sử dân tộc</p>
                        </div>
                        <div className="cover-divider"></div>
                        <p className="cover-year">{new Date().getFullYear()}</p>
                      </div>
                    )}
                    {character &&
                      currentPage > 0 &&
                      currentPage < totalPages - 1 && (
                        <div className="page-content character-info-page">
                          <div className="character-info-card">
                            <div className="info-header">
                              <div className="info-badge">
                                Thông tin chi tiết
                              </div>
                            </div>
                            <div className="info-scroll">
                              <div className="info-section">
                                <h4 className="info-title">
                                  <span className="icon">👤</span>
                                  Chức vụ
                                </h4>
                                <p className="info-text">{character.title}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="curl-back">
                    {/* Content of the next left page (for forward) or previous left page (for backward) */}
                    {nextCharacter && (
                      <div className="page-content character-image-page">
                        <div className="image-container">
                          <img
                            src={nextCharacter.image}
                            alt={nextCharacter.name}
                          />
                          <div className="image-overlay"></div>
                          <div className="image-label">
                            <h3 className="gradient-text">
                              {nextCharacter.name}
                            </h3>
                            <p>
                              {nextCharacter.personal_info.birth} -{" "}
                              {nextCharacter.personal_info.death}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentPage === totalPages - 2 && (
                      <div className="page-content">
                        <div className="back-quote">
                          "Không có gì quý hơn
                          <br />
                          độc lập, tự do"
                        </div>
                        <div className="back-divider"></div>
                        <p className="back-text">
                          {characters.length} chân dung lãnh tụ
                          <br />
                          và nhà cách mạng kiên trung
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="book-controls">
        <button
          className={`control-btn ${currentPage === 0 ? "disabled" : ""}`}
          onClick={flipBackward}
          disabled={isFlipping || currentPage === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Quay lại</span>
        </button>

        <div className="page-indicator">
          <span className="current">{currentPage + 1}</span> / {totalPages}
        </div>

        <button
          className={`control-btn ${
            currentPage === totalPages - 1 ? "disabled" : ""
          }`}
          onClick={flipForward}
          disabled={isFlipping || currentPage === totalPages - 1}
        >
          <span>Tiếp theo</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="keyboard-hint">
        <kbd>←</kbd> <kbd>→</kbd> để lật trang
      </div>
    </div>
  );
};

export default Book3DFlip;
