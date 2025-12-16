import { NextResponse } from 'next/server';

export async function GET() {
  // await 10s
  await new Promise(resolve => setTimeout(resolve, 10000));

  return NextResponse.json({
    data: '',
    count: 1
  });
}
