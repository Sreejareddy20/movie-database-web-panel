'use client'

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Unable to load movies.')
  return result
}
const castFallbackImages = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=600&q=90',
]
export const toMovie = (item: any) => ({ id: item.id, title: item.title, year: item.release_date?.slice(0, 4) || 'TBA', rating: Number((item.vote_average || 0).toFixed(1)), genre: item.genres?.[0]?.name || 'Film', image: item.poster_path ? `${IMG}${item.poster_path}` : '/placeholder.svg', backdrop: item.backdrop_path ? `${IMG}${item.backdrop_path}` : '', description: item.overview || 'No synopsis is available for this title.' })

const IMG = 'https://image.tmdb.org/t/p/w500'

const movies = [
  { id: 1, title: 'Dune: Part Two', year: '2024', rating: 8.7, genre: 'Sci-Fi', image: `${IMG}/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`, backdrop: `${IMG}/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg`, description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
  { id: 2, title: 'The Batman', year: '2022', rating: 8.0, genre: 'Crime', image: `${IMG}/74xTEgt7R36Fpooo50r9T25onhq.jpg`, backdrop: `${IMG}/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg`, description: 'When a sadistic serial killer begins murdering key political figures, Batman is forced to investigate the hidden corruption.' },
  { id: 3, title: 'Oppenheimer', year: '2023', rating: 8.6, genre: 'Drama', image: `${IMG}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`, backdrop: `${IMG}/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg`, description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
  { id: 4, title: 'Spider-Man: Across the Spider-Verse', year: '2023', rating: 8.6, genre: 'Animation', image: `${IMG}/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg`, backdrop: `${IMG}/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg`, description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.' },
  { id: 5, title: 'Guardians of the Galaxy Vol. 3', year: '2023', rating: 8.0, genre: 'Adventure', image: `${IMG}/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg`, backdrop: `${IMG}/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg`, description: 'Peter Quill rallies his team for one last mission to defend the universe and Rocket.' },
  { id: 6, title: 'Everything Everywhere All at Once', year: '2022', rating: 7.8, genre: 'Fantasy', image: `${IMG}/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg`, backdrop: `${IMG}/7trJGwprMUMKhvSx94L8H9nOM5.jpg`, description: 'An aging Chinese immigrant is swept up in an insane adventure in which she alone can save existence.' },
  { id: 7, title: 'The Godfather', year: '1972', rating: 8.7, genre: 'Crime', image: `${IMG}/3bhkrj58Vtu7enYsRolD1fZdja1.jpg`, backdrop: `${IMG}/tmU7GeKVybMWFButWEGl2M4GeiP.jpg`, description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
  { id: 8, title: 'Interstellar', year: '2014', rating: 8.7, genre: 'Sci-Fi', image: `${IMG}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`, backdrop: `${IMG}/xJHokMbljvjADYdit5fK5VQsXEG.jpg`, description: 'Explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.' },
  { id: 9, title: 'The Shawshank Redemption', year: '1994', rating: 8.7, genre: 'Drama', image: `${IMG}/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg`, backdrop: `${IMG}/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg`, description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.' },
  { id: 10, title: 'Gladiator', year: '2000', rating: 8.2, genre: 'Action', image: `${IMG}/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg`, backdrop: `${IMG}/Ar3dR6kYvKcP4tC8jJ2x7dQGmY.jpg`, description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.' },
]

export type Movie = (typeof movies)[number]

type CastMember = { name: string; character: string; image: string }

const castByMovie: Record<number, CastMember[]> = {
  1: [
    { name: 'Timothée Chalamet', character: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85' },
    { name: 'Zendaya', character: 'Chani', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85' },
    { name: 'Rebecca Ferguson', character: 'Lady Jessica', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85' },
    { name: 'Austin Butler', character: 'Feyd-Rautha', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85' },
  ],
  2: [
    { name: 'Robert Pattinson', character: 'Bruce Wayne', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=85' },
    { name: 'Zoë Kravitz', character: 'Selina Kyle', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=85' },
    { name: 'Paul Dano', character: 'The Riddler', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=500&q=85' },
    { name: 'Colin Farrell', character: 'The Penguin', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85' },
  ],
  3: [
    { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', image: `${IMG}/xQ7mP3vN5rK2bL8sT1dF6gH9j.jpg` },
    { name: 'Emily Blunt', character: 'Katherine Oppenheimer', image: `${IMG}/nT5bR2qW8mK1pL6sV9xD3fG7h.jpg` },
    { name: 'Matt Damon', character: 'Leslie Groves', image: `${IMG}/pL8qR4mN2vK6tX1sJ5dF9gH3b.jpg` },
    { name: 'Robert Downey Jr.', character: 'Lewis Strauss', image: `${IMG}/gH6jK2mP9vN4rT1sX5bL8qW3d.jpg` },
  ],
}

const defaultCast: CastMember[] = [
  { name: 'Featured performer', character: 'Lead role', image: `${IMG}/6eQOq7W4xJ4r3QmY5F7pL8nK2.jpg` },
  { name: 'Supporting performer', character: 'Supporting role', image: `${IMG}/3pQ2mN7vK5rT8xL1sJ4dF6gH9.jpg` },
  { name: 'Ensemble performer', character: 'Featured role', image: `${IMG}/9kL2mP5vR8tX1sN4qJ7dF3gH6.jpg` },
  { name: 'Guest performer', character: 'Special appearance', image: `${IMG}/2nK6mR9vP4tX7sL1qJ5dF8gH3.jpg` },
]

function getCast(movie: Movie) { return castByMovie[movie.id] ?? defaultCast }

function Header({ query, setQuery, onSearch, category }: { query: string; setQuery: (value: string) => void; onSearch: () => void; category: string }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="MovieDB home"><span className="brand-mark">M</span><span>Movie<span className="brand-accent">DB</span></span></a>
        <nav aria-label="Main navigation">
          <a href="/" aria-current={category === 'popular' ? 'page' : undefined}>Popular</a><a href="/top-rated" aria-current={category === 'top_rated' ? 'page' : undefined}>Top Rated</a><a href="/upcoming" aria-current={category === 'upcoming' ? 'page' : undefined}>Upcoming</a>
        </nav>
        <form className="search-form" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
          <label className="sr-only" htmlFor="movie-search">Search movies</label>
          <input id="movie-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Movie name" />
          <button type="submit"><Search aria-hidden="true" /> <span>Search</span></button>
        </form>
      </div>
    </header>
  )
}

function MovieCard({ movie, onOpen }: { movie: Movie; onOpen: (movie: Movie) => void }) {
  return <article className="movie-card"><button className="poster-button" onClick={() => onOpen(movie)} aria-label={`View details for ${movie.title}`}><img src={movie.image} alt={`${movie.title} poster`} /></button><button className="movie-title" onClick={() => onOpen(movie)}>{movie.title}</button><div className="movie-meta"><span>{movie.year}</span><span className="rating"><Star aria-hidden="true" /> {movie.rating}</span></div><span className="genre">{movie.genre}</span></article>
}

function MovieGrid({ list, onOpen }: { list: Movie[]; onOpen: (movie: Movie) => void }) {
  return <div className="movie-grid">{list.map((movie) => <MovieCard key={movie.id} movie={movie} onOpen={onOpen} />)}</div>
}

export function MovieDetail({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const { data } = useSWR(`/api/movies?id=${movie.id}`, fetcher)
  const cast: CastMember[] = data?.credits?.cast?.slice(0, 8).map((member: any, index: number) => ({ name: member.name, character: member.character || 'Cast member', image: member.profile_path ? `${IMG}${member.profile_path}` : castFallbackImages[index % castFallbackImages.length] })) ?? getCast(movie)
  return <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={`${movie.title} details`}><button className="close-detail" onClick={onClose} aria-label="Close movie details"><X /></button><div className="detail-backdrop" style={{ backgroundImage: `linear-gradient(90deg, #08111f 0%, rgba(8,17,31,.86) 35%, rgba(8,17,31,.35)), url(${movie.backdrop})` }} /><div className="detail-content"><img className="detail-poster" src={movie.image} alt={`${movie.title} poster`} /><div className="detail-copy"><p className="eyebrow">Movie details</p><h2>{movie.title}</h2><div className="detail-meta"><span>{movie.year}</span><span>{movie.genre}</span><span className="rating"><Star aria-hidden="true" /> {movie.rating} / 10</span></div><p>{movie.description}</p><button className="primary-action" onClick={onClose}>Back to browsing</button></div></div><section className="cast-section" aria-labelledby="cast-heading"><p className="eyebrow">Meet the ensemble</p><h3 id="cast-heading">Cast</h3><div className="cast-grid">{cast.map((member) => <article className="cast-card" key={`${movie.id}-${member.name}`}><div className="cast-avatar"><span>{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><img src={member.image || castFallbackImages[0]} alt={`${member.name} portrait`} onError={(event) => { const image = event.currentTarget; image.onerror = null; image.src = castFallbackImages[0] }} /></div><strong>{member.name}</strong><span>{member.character}</span></article>)}</div></section></div>
}

export default function Page({ category = 'popular' }: { category?: string }) {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [page, setPage] = useState(1)
  const apiUrl = activeQuery ? `/api/movies?search=${encodeURIComponent(activeQuery)}&page=${page}` : `/api/movies?category=${category}&page=${page}`
  const { data, error, isLoading } = useSWR(apiUrl, fetcher)
  const filtered = data?.results?.map(toMovie) ?? movies
  const pageCount = data ? Math.max(1, Math.min(Number(data.total_pages) || 1, 500)) : 1
  const pageTitle = category === 'top_rated' ? 'Top rated movies' : category === 'upcoming' ? 'Upcoming movies' : 'Popular right now'
  const doSearch = () => { setActiveQuery(query.trim()); setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const openMovie = (movie: Movie) => { window.location.href = `/movie/${movie.id}` }

  return <><Header query={query} setQuery={setQuery} onSearch={doSearch} category={category} /><main><section className="hero"><div className="hero-copy"><p className="eyebrow">Your next favorite film</p><h1>Find something<br /><em>great to watch.</em></h1><p className="hero-text">Explore popular movies, timeless classics, and upcoming releases curated for every kind of movie night.</p><a className="hero-link" href="#movies">Browse movies <ChevronRight aria-hidden="true" /></a></div><div className="hero-poster"><img src={movies[0].image} alt="Dune Part Two poster" /><div className="hero-poster-glow" /></div><div className="hero-stats"><span><strong>10k+</strong> movies to discover</span><span><strong>4.8</strong> average community rating</span></div></section>
    <section className="section" id="movies"><div className="section-heading"><div><p className="eyebrow">{activeQuery ? 'Explore the collection' : category === 'upcoming' ? 'Mark your calendar' : category === 'top_rated' ? 'Critically acclaimed' : 'Explore the collection'}</p><h2>{activeQuery ? `Results for “${activeQuery}”` : pageTitle}</h2></div><span className="result-count">{data?.total_results ?? filtered.length} titles</span></div>{isLoading ? <div className="empty-state">Loading movies from TMDB...</div> : error ? <div className="empty-state" role="alert">{error.message}. Check your TMDB_API_KEY configuration and try again.</div> : filtered.length ? <MovieGrid list={filtered} onOpen={openMovie} /> : <div className="empty-state">No movies found. Try another search.</div>}<div className="pagination"><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} aria-label="Previous page"><ChevronLeft /></button><span>Page <strong>{page}</strong> of {pageCount}</span><button onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page >= pageCount} aria-label="Next page"><ChevronRight /></button></div></section>
  </main><footer><a className="brand" href="/"><span className="brand-mark">M</span>Movie<span className="brand-accent">DB</span></a><span>Made for people who love movies.</span></footer></>
}
