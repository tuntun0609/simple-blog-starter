import dayjs from 'dayjs'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useMDXComponent } from 'next-contentlayer2/hooks'

import { GiscusComment } from '@/components/comment'
import MDXComponents from '@/components/mdx'
import ScrollTopButton from '@/components/scroll-to-top'
import TOC from '@/components/toc'
import { cn, sortBlogs } from '@/lib/utils'
import { allBlogs } from 'contentlayer/generated'

const blogs = sortBlogs(allBlogs)

dayjs.locale('zh-cn')

export const generateStaticParams = async () =>
  allBlogs.map(post => ({ slug: post.slug.split('/') }))

export const generateMetadata = ({ params }: { params: { slug: string[] } }) => {
  const slug = decodeURI(params.slug.join('/'))

  const post = blogs.find(post => post.slug === slug)
  if (!post) {
    notFound()
  }
  return { title: post.title }
}

const BlogLayout = ({ params }: { params: { slug: string[] } }) => {
  const slug = decodeURI(params.slug.join('/'))

  const postIndex = blogs.findIndex(post => post.slug === slug)
  const prevBlog = blogs[postIndex + 1]
  const nextBlog = blogs[postIndex - 1]
  const blog = blogs.find(post => post.slug === slug)

  if (!blog) {
    throw new Error(`Post not found for slug: ${params.slug}`)
  }

  const MDXContent = useMDXComponent(blog.body.code)

  return (
    <div className="flex">
      <aside className="hidden flex-col pr-6 lg:flex lg:w-1/5" />
      <article className={cn('mx-auto w-full max-w-xl px-8 py-8 md:px-0 lg:w-3/5')}>
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{blog.title}</h1>
          <div className="text-sm text-gray-600">
            <time dateTime={blog.date}>{dayjs(blog.date).format('YYYY-MM-DD HH:mm')}</time>
            <div>阅读时间: {blog.readingTime}</div>
          </div>
        </div>
        <div id="article">
          <MDXContent components={MDXComponents} />
        </div>

        <div className={cn('flex justify-between', (prevBlog || nextBlog) && 'my-8')}>
          <div>
            {prevBlog && (
              <Link href={`/blog/${prevBlog.slug}`} className="text-blue-600">
                ← {prevBlog.title}
              </Link>
            )}
          </div>
          <div>
            {nextBlog && (
              <Link href={`/blog/${nextBlog.slug}`} className="text-blue-600">
                {nextBlog.title} →
              </Link>
            )}
          </div>
        </div>

        <GiscusComment />
        <ScrollTopButton />
      </article>

      <div className="hidden flex-col pr-6 lg:flex lg:w-1/5">
        <div className="sticky right-0 top-16 mt-8">
          <TOC />
        </div>
      </div>
    </div>
  )
}

export default BlogLayout
