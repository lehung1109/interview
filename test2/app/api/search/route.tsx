import { NextResponse } from 'next/server';

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export async function GET() {
  const randomStrings = Array.from({ length: 3000000 }, () => generateRandomString(3));

  return NextResponse.json({
    data: randomStrings,
    count: randomStrings.length
  });
}
