import { NextResponse } from 'next/server';


interface OpenAlexWork {
  id: string;
  display_name: string;
  publication_year: number;
  cited_by_count?: number;
  counts_by_year?: { year: number; cited_by_count: number }[];
  doi?: string;
  open_access?: { is_oa: boolean };
  concepts?: { display_name: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'search';
  const email = "bhakssadia@gmail.com";

  const url = `https://api.openalex.org/works?search=${query}&mailto=${email}&per-page=10&select=id,display_name,publication_year,cited_by_count,doi,open_access,concepts,counts_by_year`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    
    const formattedResults = data.results.map((work: OpenAlexWork) => ({
      id: work.id,
      title: work.display_name,
      publication_year: work.publication_year,
      cited_by_count: work.cited_by_count || 0,
      counts_by_year: work.counts_by_year || [],
      
      doi: work.doi ? (work.doi.startsWith('http') ? work.doi : `https://doi.org/${work.doi}`) : null,
      is_oa: work.open_access?.is_oa || false,
      tags: work.concepts?.slice(0, 3).map(c => c.display_name) || []
    }));

    return NextResponse.json({ results: formattedResults });
  } catch (error) {
    console.error("OpenAlex Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from OpenAlex" },
      { status: 500 }
    );
  }
}