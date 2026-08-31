import { NavLink } from 'react-router-dom'
import { getBlogPosts } from '../lib/cms'
import usePageTitle from '../hooks/usePageTitle'

function Blogs() {
  usePageTitle('Blog')
  const posts = getBlogPosts().filter((p) => p.enabled !== false)

  const formatPublishDate = (post) => {
    const value = post.publishedAt || post.published_at || post.createdAt || post.created_at
    if (!value) return 'Published'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Published' : `Published ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  }

  return (
    <section className="page-card">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Blog</p>
        <h1 className="text-3xl font-bold text-zinc-900">Latest Travel Insights</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">Stay up to date with our latest news, tips, and service updates for Abbey Cars.</p>
      </div>

      {posts.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              {post.featured_image ? (
                <div className="mb-5 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100">
                  <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <h2 className="text-xl font-semibold text-black">
                <NavLink to={`/blogs/${post.slug}`} className="hover:text-yellow-600">
                  {post.title}
                </NavLink>
              </h2>
              <div className="mt-2 text-sm text-zinc-500">{formatPublishDate(post)}</div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{post.excerpt || post.meta?.description || 'Travel news and service updates.'}</p>
              <NavLink to={`/blogs/${post.slug}`} className="mt-5 inline-flex rounded-[20px] bg-black px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-zinc-800">
                Read Blog
              </NavLink>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-6 text-zinc-600">
          No blog posts are available right now. Please check back later.
        </div>
      )}
    </section>
  )
}

export default Blogs
