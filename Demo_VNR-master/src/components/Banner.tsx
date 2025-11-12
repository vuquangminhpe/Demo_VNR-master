import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const bannerSlides = [
  {
    name: 'Hồ Chí Minh',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Bac_Ho.jpg/640px-Bac_Ho.jpg',
    quote: 'Không có gì quý hơn độc lập, tự do.',
    subtitle: 'Chủ tịch nước Việt Nam Dân chủ Cộng hòa'
  },
  {
    name: 'Trường Chinh',
    image:
      'https://file3.qdnd.vn/data/images/0/2025/01/27/upload_2237/5.png?dpi=150&quality=100&w=870',
    quote: 'Đổi mới nhưng không đổi màu.',
    subtitle: 'Tổng Bí thư Đảng Cộng sản Việt Nam'
  },
  {
    name: 'Võ Nguyên Giáp',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/V%C3%B5_Nguy%C3%AAn_Gi%C3%A1p_%281954%29.jpg/640px-V%C3%B5_Nguy%C3%AAn_Gi%C3%A1p_%281954%29.jpg',
    quote: 'Chiến thắng Điện Biên Phủ: Lừng lẫy năm châu, chấn động địa cầu.',
    subtitle: 'Đại tướng, Anh hùng Lực lượng vũ trang nhân dân'
  }
]

const Banner = () => {
  const bannerRef = useRef<HTMLDivElement>(null)
  const currentSlideRef = useRef(0)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Star background particles
  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    // Create floating stars
    const createStars = () => {
      const starsContainer = document.createElement('div')
      starsContainer.className = 'stars-container'
      banner.appendChild(starsContainer)

      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.animationDelay = `${Math.random() * 3}s`
        star.style.animationDuration = `${2 + Math.random() * 3}s`
        starsContainer.appendChild(star)
      }
    }

    createStars()
  }, [])

  // Initial animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(imageRef.current, {
        scale: 1.3,
        opacity: 0,
        duration: 1.5
      })
        .from(
          titleRef.current,
          {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
          },
          '-=0.8'
        )
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8
          },
          '-=0.5'
        )
        .from(
          quoteRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8
          },
          '-=0.5'
        )
    }, bannerRef)

    return () => ctx.revert()
  }, [])

  // Parallax effect on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(parallaxRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })
    }, bannerRef)

    return () => ctx.revert()
  }, [])

  // Auto slide
  useEffect(() => {
    const changeSlide = () => {
      const nextSlide = (currentSlideRef.current + 1) % bannerSlides.length
      currentSlideRef.current = nextSlide

      const slide = bannerSlides[nextSlide]

      // Animate out
      const tl = gsap.timeline()
      tl.to([titleRef.current, subtitleRef.current, quoteRef.current], {
        y: -50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1
      })
        .to(
          imageRef.current,
          {
            scale: 1.1,
            opacity: 0,
            duration: 0.5
          },
          '<'
        )
        .call(() => {
          // Update content
          if (titleRef.current) titleRef.current.textContent = slide.name
          if (subtitleRef.current) subtitleRef.current.textContent = slide.subtitle
          if (quoteRef.current) quoteRef.current.textContent = `"${slide.quote}"`
          if (imageRef.current) imageRef.current.src = slide.image
        })
        .to(imageRef.current, {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        })
        .to(
          [titleRef.current, subtitleRef.current, quoteRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
          },
          '-=0.6'
        )
    }

    const interval = setInterval(changeSlide, 6000)
    return () => clearInterval(interval)
  }, [])

  const firstSlide = bannerSlides[0]

  return (
    <section ref={bannerRef} className="hero-banner">
      {/* Background Gradient */}
      <div className="hero-gradient"></div>

      {/* Parallax Image */}
      <div ref={parallaxRef} className="hero-parallax">
        <img
          ref={imageRef}
          src={firstSlide.image}
          alt={firstSlide.name}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="hero-content">
        <div className="container">
          <div className="hero-text">
            <p ref={subtitleRef} className="hero-subtitle">
              {firstSlide.subtitle}
            </p>
            <h1 ref={titleRef} className="hero-title">
              {firstSlide.name}
            </h1>
            <p ref={quoteRef} className="hero-quote">
              "{firstSlide.quote}"
            </p>
            <div className="hero-divider"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <span>Cuộn xuống</span>
      </div>
    </section>
  )
}

export default Banner
