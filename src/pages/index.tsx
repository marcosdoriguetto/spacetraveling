import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useState } from 'react'

import { AiOutlineCalendar as CalendarIcon } from 'react-icons/ai'
import { BsPerson as PersonIcon } from 'react-icons/bs'

import { getPrismicClient } from '../services/prismic'

import { dateFormat } from '../helpers/dateFormat'

import { HomeProps, Post } from './Home.interface'

import { IconInformation } from '../components/IconInformation'

import styles from './home.module.scss'
import commonStyles from '../styles/common.module.scss'

export default function Home({ postsPagination }: HomeProps) {
  const { isFallback } = useRouter()

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

  if (isFallback) {
    return <div>Loading...</div>
  }

  return (
    <main className={commonStyles.container}>
      <section className={styles.posts}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <div className={styles.postContainer}>
                <div className={styles.postHeader}>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                </div>

                <div className={commonStyles.postIconInformationContainer}>
                  <IconInformation
                    icon={() => <CalendarIcon fontSize="1.25rem" />}
                    information={post.first_publication_date as string}
                  />

                  <IconInformation
                    icon={() => <PersonIcon fontSize="1.25rem" />}
                    information={post.data.author}
                  />
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
    fallback: true
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
    revalidate: 60 * 30 // 30 minutes
  }
}
