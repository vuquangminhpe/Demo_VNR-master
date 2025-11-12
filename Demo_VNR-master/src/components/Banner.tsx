import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const bannerSlides = [
  {
    name: 'Hồ Chí Minh',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Bac_Ho.jpg/640px-Bac_Ho.jpg',
    quote: 'Không có gì quý hơn độc lập, tự do.'
  },
  {
    name: 'Trường Chinh',
    image:
      'https://file3.qdnd.vn/data/images/0/2025/01/27/upload_2237/5.png?dpi=150&quality=100&w=870',
    quote: 'Đổi mới nhưng không đổi màu.'
  },
  {
    name: 'Võ Nguyên Giáp',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/V%C3%B5_Nguy%C3%AAn_Gi%C3%A1p_%281954%29.jpg/640px-V%C3%B5_Nguy%C3%AAn_Gi%C3%A1p_%281954%29.jpg',
    quote: 'Chiến thắng Điện Biên Phủ: Lừng lẫy năm châu, chấn động địa cầu.'
  }
]

const Banner = () => {
  return (
    <section id="banner" className="banner">
      <Swiper
        modules={[Navigation, Pagination, EffectFade, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="banner-swiper"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.name}>
            <div className="banner-slide">
              <img src={slide.image} alt={slide.name} />
              <div className="banner-content">
                <h2>{slide.name}</h2>
                <p>{slide.quote}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default Banner
