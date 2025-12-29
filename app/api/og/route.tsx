import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

// Cache font data to avoid repeated fetches
const fontCache = new Map<string, ArrayBuffer>();

async function loadGoogleFont(font: string, text: string): Promise<ArrayBuffer> {
  const cacheKey = `${font}-${text}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@600&text=${encodeURIComponent(text)}`;

  const css = await fetch(url, { next: { revalidate: 86400 } }).then((res) => res.text());
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (!match?.[1]) {
    throw new Error(`Failed to load font: ${font}`);
  }

  const fontData = await fetch(match[1]).then((res) => {
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return res.arrayBuffer();
  });

  fontCache.set(cacheKey, fontData);
  return fontData;
}

function ErrorResponse(message: string) {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: '#888',
        fontSize: 24,
        fontFamily: 'sans-serif',
      }}
    >
      {message}
    </div>,
    { width: 1200, height: 630 },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const username = searchParams.get('username');
  const ide = searchParams.get('ide');
  const setupName = searchParams.get('name');

  if (!setupName) {
    return ErrorResponse('Missing name parameter');
  }

  if (!username) {
    return ErrorResponse('Missing username parameter');
  }

  try {
    const displayText = setupName ? `${setupName} • @${username}` : `@${username}`;
    const fontData = await loadGoogleFont('Oxanium', displayText + ide);
    const bgImageUrl = `${origin}/images/og/og-bg-dy.png`;

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontFamily: 'Oxanium',
          position: 'relative',
        }}
      >
        {/* Background Image - img required for OG ImageResponse */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImageUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: 'Oxanium',
              fontSize: 80,
              fontWeight: 600,
              color: '#fff',
              margin: 0,
              marginBottom: 8,
            }}
          >
            {setupName}
          </h1>

          <h2
            style={{
              fontFamily: 'Oxanium',
              fontSize: 60,
              fontWeight: 600,
              color: '#fff',
              margin: 0,
              marginBottom: 30,
            }}
          >
            {ide && `By `} @{username}
          </h2>

          {ide && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                gap: 8,
                backgroundColor: '#c6c6c675',
                border: '1px solid #b3b3b3',
                borderRadius: 8,
                padding: '8px 16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Oxanium',
                  fontSize: 50,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {ide}
              </span>
            </div>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Oxanium',
            data: fontData,
            style: 'normal',
            weight: 600,
          },
        ],
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    );
  } catch {
    return ErrorResponse('Failed to generate image');
  }
}
