import usePageTitle from '../hooks/usePageTitle'

function About() {
  usePageTitle('About')

  return (
    <section className="page-card">
      <h1>About</h1>
    </section>
  )
}

export default About
