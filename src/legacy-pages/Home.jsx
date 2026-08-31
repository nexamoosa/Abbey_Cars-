import Hero_section from '../components/UI/Hero_section'
import Hero_Booking_form from '../components/UI/Hero_Booking_form'
import Hero_our_fleets from '../components/UI/Hero_our_fleets'
import ServiceGrid from '../components/UI/services/ServiceGrid'
import ServiceAreas from '../components/UI/services/ServiceAreas'
import Testimonials from '../components/UI/services/Testimonials'
import WhyChooseUs from '../components/UI/services/WhyChooseUs'
import { DownloadApp, HomeFinalCTA, HowToBook, ReadingIntro } from '../components/UI/HomeContentSections'
import usePageTitle from '../hooks/usePageTitle'

function Home() {
  usePageTitle('Home')

  return (
    <main>
      <Hero_section className="z-1" />
      <Hero_Booking_form className="z-2"/>
      <ServiceGrid />
      <Hero_our_fleets/>
      <ReadingIntro />
      <ServiceAreas />
      <WhyChooseUs />
      <HowToBook />
      <DownloadApp />
      <Testimonials />
      <HomeFinalCTA />
    </main>
  )
}

export default Home
