export async function GET(request, { params }) {
    const channelId = decodeURIComponent(params.channelId);

    try {
        const streamResponse = await fetch(channelId, {
            headers: {
                'User-Agent': 'PostmanRuntime/7.35.0',
                'Accept': '*/*',
            },
        });

        if (!streamResponse.ok) {
            return new Response('Stream fetch failed', { status: streamResponse.status });
        }

        const streamData = await streamResponse.text();

        return new Response(streamData, {
            headers: {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response('Stream not found', { status: 404 });
    }
}
