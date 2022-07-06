import { ParsedUrlQuery } from 'querystring'

interface Post {
  first_publication_date: string | null
  data: {
    title: string
    banner: {
      url: string
    }
    author: string
    content: {
      heading: string
      body: {
        text: string
      }[]
    }[]
    readingTime: string
  }
}

export interface PostProps {
  post: Post
}

export interface IParams extends ParsedUrlQuery {
  slug: string
}
