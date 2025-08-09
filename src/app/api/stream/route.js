// app/api/stream/route.js
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) {
        return new Response("Missing URL", { status: 400 });
    }


    try {
        const res = await fetch(url);
        if (!res.ok) {
            return new Response('Failed fetching stream', { status: res.status });
        }

        let contentType = res.headers.get('content-type') || '';
        let body;

        if (contentType.includes('application/vnd.apple.mpegurl') || url.endsWith('.m3u8')) {
            let playlist = await res.text();
            const baseURL = url.substring(0, url.lastIndexOf('/') + 1);

            // Replace relative paths with absolute URLs
            playlist = playlist.replace(
                /^(?!#)(.*\.(m3u8|ts).*)$/gm,
                segment => {
                    if (segment.startsWith('http')) {
                        return `/api/stream?url=${encodeURIComponent(segment)}`;
                    }
                    return `/api/stream?url=${encodeURIComponent(baseURL + segment)}`;
                }
            );

            body = playlist;
            contentType = 'application/vnd.apple.mpegurl';
        } else {
            body = res.body;
        }

        return new Response(body, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err) {
        console.error(err);
        return new Response('Stream not found', { status: 404 });
    }
}
