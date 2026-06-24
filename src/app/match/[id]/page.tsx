import { Metadata } from 'next';
import { allMatches } from '@/data/matches';
import { MatchView } from './MatchView';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const match = allMatches.find((m) => m.id === id);
  if (!match) return { title: 'Match not found — Wc26Live' };

  const a = match.teamA?.name ?? 'TBD';
  const b = match.teamB?.name ?? 'TBD';
  return {
    title: `${a} vs ${b} — Wc26Live`,
    description: `Watch ${a} vs ${b} live on Wc26Live. Free HD stream.`,
    openGraph: {
      title: `${a} vs ${b} — Wc26Live`,
      description: `Watch ${a} vs ${b} live on Wc26Live. Free HD stream.`,
    },
  };
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;
  return <MatchView matchId={id} />;
}