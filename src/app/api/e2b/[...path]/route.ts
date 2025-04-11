import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get('subdomain');
  if (!subdomain) {
    return NextResponse.json({ error: 'Missing subdomain' }, { status: 400 });
  }

  const path = req.nextUrl.pathname.replace('/api/e2b/', '');
  const url = `https://${subdomain}.e2b.app/${path}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-e2b-api-key': 'key here'
      },
      body: await req.text()
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (error) {
    console.error('E2B API Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to E2B' },
      { status: 500 }
    );
  }
}
