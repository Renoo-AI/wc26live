import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use ip-api.com free tier (no key needed)
    const res = await fetch('http://ip-api.com/json/?fields=status,countryCode,country', {
      next: { revalidate: 86400 }, // Cache for 24h
    });
    const data = await res.json();

    if (data.status === 'success') {
      // Map country code to flag emoji
      const codePoints = data.countryCode
        .toUpperCase()
        .split('')
        .map((char: string) => 127397 + char.charCodeAt(0));
      const flag = String.fromCodePoint(...codePoints);

      return NextResponse.json({
        countryCode: data.countryCode,
        countryName: data.country,
        flag,
      });
    }

    return NextResponse.json({ countryCode: 'US', countryName: 'United States', flag: '🇺🇸' });
  } catch {
    return NextResponse.json({ countryCode: 'US', countryName: 'United States', flag: '🇺🇸' });
  }
}