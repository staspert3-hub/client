import { NextRequest, NextResponse } from 'next/server';
import { API } from './lib/API';

export default async function (request: NextRequest) {
    console.log('proxy')
    const proxy_url = request.nextUrl.pathname.split('/').filter((i) => i !== '')
    const room_id = proxy_url[1];
    const name_user = proxy_url[2];
    if (!room_id || !name_user) {
        return NextResponse.redirect(new URL('/error', request.url));
    }
    try {
        const res = await fetch(`${API.api}/auth/find_user`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                room_id: proxy_url[1],
                name_user: proxy_url[2]
            })
        })
        const json = await res.json()
        console.log(json)
        if (json.s) {
            console.log(json.s)
            return NextResponse.next()
        }
        console.log('s')
        return NextResponse.redirect('http://localhost:3000/error')
    } catch (e) {
        console.error(e)
        return NextResponse.redirect('http://localhost:3000/error')
    }
}

export const config = {
    matcher: [
        '/chats/:path*'
    ]
}