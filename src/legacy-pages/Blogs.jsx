import { NavLink } from 'react-router-dom'
import { getBlogPosts } from '../lib/cms'
import usePageTitle from '../hooks/usePageTitle'

function Blogs() {
  usePageTitle('Blog')
  const posts = getBlogPosts().filter((p) => p.enabled !== false)

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
              <div className="mb-4 text-sm text-zinc-500">{post.meta?.description || 'Travel news and service updates'}</div>
              <NavLink to={`/blogs/${post.slug}`} className="text-xl font-semibold text-black hover:text-blue-600">
                {post.title}
              </NavLink>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{post.meta?.description || 'Read more about our transfer services, local coverage, and travel guides.'}</p>
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
