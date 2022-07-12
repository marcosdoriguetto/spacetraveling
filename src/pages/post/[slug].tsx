import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

import {
  AiOutlineCalendar as CalendarIcon,
  AiOutlineClockCircle as ClockIcon
} from 'react-icons/ai'
import { BsPerson as PersonIcon } from 'react-icons/bs'

import { IconInformation } from '../../components/IconInformation'

import { RichText } from 'prismic-dom'

import { dateFormat } from '../../helpers/dateFormat'

import { getPrismicClient } from '../../services/prismic'

import commonStyles from '../../styles/common.module.scss'
import styles from './post.module.scss'

import { IParams, PostProps } from './Post.interface'

export default function Post({ post }: PostProps) {
  const { isFallback } = useRouter()

  const amountWordsInBody = RichText.asText(
    post.data.content.reduce(
      (acc: { text: string }[], cur) => [...acc, ...cur.body],
      []
    )
  ).split(' ').length

  const amountWordsInHeading = RichText.asText(
    post.data.content.reduce(
      (acc: string[], cur) => [...acc, ...cur.heading],
      []
    )
  ).split(' ').length

  const readingTime = Math.ceil(
    (amountWordsInBody + amountWordsInHeading) / 200
  )

  const postFormat = {
    first_publication_date: dateFormat(post.first_publication_date),
    data: post.data
  }

  if (isFallback) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <div className={styles.imageContainer}>
        <Image layout="fill" quality={100} src={post.data.banner.url} />
      </div>

      <main className={`${commonStyles.container} ${styles.postContent}`}>
        <h1>{postFormat.data.title}</h1>

        <div className={commonStyles.postIconInformationContainer}>
          <IconInformation
            icon={() => <CalendarIcon fontSize="1.25rem" />}
            information={postFormat.first_publication_date as string}
          />

          <IconInformation
            icon={() => <PersonIcon fontSize="1.25rem" />}
            information={postFormat.data.author}
          />

          <IconInformation
            icon={() => <ClockIcon fontSize="1.25rem" />}
            information={`${String(readingTime)} min`}
          />
        </div>
        <div>
          {postFormat.data.content.map(({ heading, body }) => (
            <div className={styles.postSection} key={heading}>
              <h2>{heading}</h2>

              <div
                className={styles.postBody}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({})

  const response = await prismic.getByType('posts')

  const paths = response.results.map(post => ({
    params: {
      slug: post.uid as string
    }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as IParams
  const prismic = getPrismicClient({})

  const response = await prismic.getByUID('posts', String(slug), {})

  return {
    props: {
      post: response
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
