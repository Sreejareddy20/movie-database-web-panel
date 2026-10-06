'use client'

import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { MovieDetail, toMovie } from '../../../components/movie-browser'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Unable to load movie details.')
  return result
}

export default function MoviePage() {
  const { id } = useParams<{ id: string }>()
  const { data, error, isLoading } = useSWR(`/api/movies?id=${encodeURIComponent(id)}`, fetcher)

  if (isLoading) return <main className="empty-state">Loading movie details...</main>
  if (error) return <main className="empty-state" role="alert">{error.message}. Check your TMDB_API_KEY configuration and try again.</main>
  if (!data) return <main className="empty-state">Movie not found.</main>

  return <MovieDetail movie={toMovie(data)} onClose={() => { window.location.href = '/' }} />
}
