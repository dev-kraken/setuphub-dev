import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

import { clampToCodePoints } from '@/lib/og/clamp';
import { loadGoogleFont } from '@/lib/og/font';

export const runtime = 'edge';

const ONE_DAY_SECONDS = 60 * 60 * 24;
const ONE_WEEK_SECONDS = ONE_DAY_SECONDS * 7;

const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// Param length caps. Truncating server-side keeps Satori's layout pass cheap
// (huge titles otherwise force wrap calculations on every cold render) and
// prevents abuse of the dynamic OG endpoint to render arbitrary long strings.
const TITLE_MAX = 120;
const DESCRIPTION_MAX = 200;
const AUTHOR_MAX = 60;

function ErrorResponse(message: string, status: 400 | 500 = 400) {
  return new ImageResponse(
    (
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
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      status,
      headers: {
        // Short-cache 400s so a typo'd link from a crawler doesn't hammer us,
        // but let 500s recover fast once upstream is healthy.
        'Cache-Control': status === 400 ? 'public, max-age=300, s-maxage=300' : 'no-store',
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = clampToCodePoints(searchParams.get('title'), TITLE_MAX);
  const description = clampToCodePoints(searchParams.get('description'), DESCRIPTION_MAX);
  const author = clampToCodePoints(searchParams.get('author'), AUTHOR_MAX);

  if (!title) {
    return ErrorResponse('Missing title parameter');
  }

  try {
    // Subset request: only the glyphs we actually paint. Combined with the
    // module-level font cache this turns the slow 2nd-fetch (woff binary)
    // into a single small, deduped request per unique character set.
    const fontText = `SetupHub · Blog By ${title}${description}${author}`;
    const fontData = await loadGoogleFont({ font: 'Oxanium', text: fontText });

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            // Pure CSS background — no remote image fetch. Saves a network
            // round trip on every cold render compared to the setup OG route.
            backgroundColor: '#0a0a0a',
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(120, 119, 198, 0.18), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255, 119, 198, 0.10), transparent 50%)',
            fontFamily: 'Oxanium',
            color: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 24,
              color: '#a3a3a3',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: '#22c55e',
              }}
            />
            <span style={{ fontWeight: 600 }}>SetupHub</span>
            <span style={{ color: '#525252' }}>·</span>
            <span style={{ fontWeight: 600 }}>Blog</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <h1
              style={{
                fontFamily: 'Oxanium',
                fontWeight: 600,
                fontSize: 72,
                lineHeight: 1.05,
                margin: 0,
                color: '#fafafa',
                // Two-line cap so Satori doesn't blow the layout on long
                // titles — the server-side clamp above is the hard limit.
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>

            {description && (
              <p
                style={{
                  fontFamily: 'Oxanium',
                  fontWeight: 600,
                  fontSize: 30,
                  lineHeight: 1.35,
                  margin: 0,
                  color: '#a3a3a3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {description}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 26,
              color: '#a3a3a3',
            }}
          >
            <span style={{ color: '#d4d4d4', fontWeight: 600 }}>
              {author ? `By ${author}` : 'setuphub.dev'}
            </span>
            <span style={{ color: '#525252' }}>setuphub.dev/blog</span>
          </div>
        </div>
      ),
      {
        ...OG_IMAGE_SIZE,
        fonts: [
          {
            name: 'Oxanium',
            data: fontData,
            style: 'normal',
            weight: 600,
          },
        ],
        headers: {
          'Cache-Control': `public, max-age=${ONE_DAY_SECONDS}, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_WEEK_SECONDS}`,
        },
      },
    );
  } catch (error) {
    console.error('Blog OG image generation failed:', error);
    return ErrorResponse('Failed to generate image', 500);
  }
}
