import { NextResponse } from 'next/server'

const TMDB = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'TMDB_API_KEY is not configured' }, { status: 500 })

  const id = searchParams.get('id')
  const search = searchParams.get('search')
  const category = searchParams.get('category') ?? 'popular'
  const page = searchParams.get('page') ?? '1'
  const endpoint = id
    ? `${TMDB}/movie/${encodeURIComponent(id)}?api_key=${apiKey}&language=en-US&append_to_response=credits`
    : search
      ? `${TMDB}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(search)}&page=${page}`
      : `${TMDB}/movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`

  const response = await fetch(endpoint, { next: { revalidate: 300 } })
  if (!response.ok) return NextResponse.json({ error: 'TMDB request failed' }, { status: response.status })
  return NextResponse.json(await response.json())
}
