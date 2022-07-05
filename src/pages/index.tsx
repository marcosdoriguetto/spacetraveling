import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'

import { useState } from 'react'

import { AiOutlineCalendar } from 'react-icons/ai'
import { BsPerson } from 'react-icons/bs'

import { getPrismicClient } from '../services/prismic'

import { dateFormat } from '../helpers/dateFormat'

import { HomeProps, Post } from './Home.interface'

import styles from './home.module.scss'

export default function Home({ postsPagination }: HomeProps) {
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  )
  const [posts, setPosts] = useState(postsPagination.results)

  function loadMorePosts() {
    fetch(nextPage as string)
      .then(res => res.json())
      .then(data => {
        setNextPage(data.next_page)
        setPosts(prevState => [
          ...prevState,
          ...data.results.map((result: Post) => ({
            ...result,
            first_publication_date: dateFormat(result.first_publication_date)
          }))
        ])
      })
  }

  return (
    <main>
      <section className={styles.posts}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <div className={styles.postContainer}>
                <div className={styles.postHeader}>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                </div>

                <div className={styles.postFooter}>
                  <span>
                    <AiOutlineCalendar fontSize="1.25rem" />
                    {post.first_publication_date}
                  </span>
                  <span>
                    <BsPerson fontSize="1.25rem" /> {post.data.author}
                  </span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </section>

      {nextPage && (
        <span className={styles.loadMorePosts} onClick={loadMorePosts}>
          Carregar mais posts
        </span>
      )}
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({})

  const response = await prismic.getByType('posts', {
    pageSize: 1
  })

  const postsPagination = {
    next_page: response.next_page,
    results: response.results.map(result => ({
      ...result,
      first_publication_date: dateFormat(result.first_publication_date)
    }))
  }

  return {
    props: {
      postsPagination
    },
    revalidate: 30 * 60 // 30 minutes
  }
}
