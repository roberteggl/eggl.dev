import { NextResponse } from 'next/server'
import { GPG_KEY } from '@/data/gpg-key'

export async function GET() {
	return new NextResponse(GPG_KEY, {
		headers: {
			'Content-Type': 'text/plain',
			'Content-Disposition': 'attachment; filename="robert-eggl.asc"'
		}
	})
}
