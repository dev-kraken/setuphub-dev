import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';

import { clampToCodePoints } from '@/lib/og/clamp';
import { loadGoogleFont } from '@/lib/og/font';

export const runtime = 'edge';

const ONE_DAY_SECONDS = 60 * 60 * 24;
const ONE_WEEK_SECONDS = ONE_DAY_SECONDS * 7;

const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// Param length caps — mirror the blog OG route for consistency and to keep
// Satori's layout pass cheap on cold renders.
const USERNAME_MAX = 64;
const NAME_MAX = 120;
const IDE_MAX = 32;

function ErrorResponse(message: string, status: 400 | 500 = 400) {
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
    {
      ...OG_IMAGE_SIZE,
      status,
      headers: {
        // Cache client errors briefly so repeated bad params don't hammer the route,
        // but let upstream recovery surface quickly for server errors.
        'Cache-Control': status === 400 ? 'public, max-age=300, s-maxage=300' : 'no-store',
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const username = clampToCodePoints(searchParams.get('username'), USERNAME_MAX);
  const ide = clampToCodePoints(searchParams.get('ide'), IDE_MAX);
  const setupName = clampToCodePoints(searchParams.get('name'), NAME_MAX);

  if (!setupName) {
    return ErrorResponse('Missing name parameter');
  }

  if (!username) {
    return ErrorResponse('Missing username parameter');
  }

  try {
    // `setupName` is guarded above, so the ternary that was here is dead.
    const displayText = `${setupName} • @${username}`;
    const fontData = await loadGoogleFont({ font: 'Oxanium', text: displayText + ide });
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
            {ide ? 'By ' : null} @{username}
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
    console.error('OG image generation failed:', error);
    return ErrorResponse('Failed to generate image', 500);
  }
}
