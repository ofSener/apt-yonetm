import { NextRequest, NextResponse } from 'next/server';

// Bu dosya Socket.io için bir API endpoint sağlar
// Socket.io kendi bağlantısını yönetir

export async function GET(req: NextRequest) {
  // Socket.io kendi web socket bağlantısını yönettiği için burada herhangi bir şey yapmamıza gerek yok
  return new NextResponse('Socket.io endpoint', { status: 200 });
}

// POST isteklerini de destekleyelim
export async function POST(req: NextRequest) {
  return new NextResponse('Socket.io endpoint', { status: 200 });
} 