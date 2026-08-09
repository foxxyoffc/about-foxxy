const VT_API = 'https://www.virustotal.com/api/v3';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            success: false,
            error: 'VIRUSTOTAL_API_KEY belum dikonfigurasi di Vercel.'
        });
    }

    try {
        const body = req.body || {};
        const action = body.action;

        /*
        =====================================================
        SCAN URL
        =====================================================
        */

        if (action === 'url') {
            const url = String(body.url || '').trim();

            if (!url) {
                return res.status(400).json({
                    success: false,
                    error: 'URL wajib diisi.'
                });
            }

            try {
                new URL(url);
            } catch {
                return res.status(400).json({
                    success: false,
                    error: 'URL tidak valid.'
                });
            }

            const form = new URLSearchParams();
            form.append('url', url);

            const response = await fetch(`${VT_API}/urls`, {
                method: 'POST',
                headers: {
                    'x-apikey': apiKey,
                    'Content-Type':
                        'application/x-www-form-urlencoded'
                },
                body: form.toString()
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({
                    success: false,
                    error:
                        data?.error?.message ||
                        'VirusTotal gagal memproses URL.'
                });
            }

            return res.status(200).json({
                success: true,
                type: 'url',
                analysisId: data?.data?.id || null,
                data
            });
        }

        /*
        =====================================================
        GET UPLOAD URL UNTUK FILE LOKAL
        =====================================================
        */

        if (action === 'upload-url') {
            const response = await fetch(
                `${VT_API}/files/upload_url`,
                {
                    method: 'GET',
                    headers: {
                        'x-apikey': apiKey
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({
                    success: false,
                    error:
                        data?.error?.message ||
                        'Gagal mendapatkan upload URL VirusTotal.'
                });
            }

            return res.status(200).json({
                success: true,
                type: 'upload-url',
                uploadUrl: data?.data || null
            });
        }

        /*
        =====================================================
        GET HASIL ANALYSIS
        =====================================================
        */

        if (action === 'analysis') {
            const analysisId = String(
                body.analysisId || ''
            ).trim();

            if (!analysisId) {
                return res.status(400).json({
                    success: false,
                    error: 'analysisId wajib diisi.'
                });
            }

            const response = await fetch(
                `${VT_API}/analyses/${encodeURIComponent(
                    analysisId
                )}`,
                {
                    method: 'GET',
                    headers: {
                        'x-apikey': apiKey
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json({
                    success: false,
                    error:
                        data?.error?.message ||
                        'Gagal mengambil hasil scan VirusTotal.'
                });
            }

            const attributes =
                data?.data?.attributes || {};

            return res.status(200).json({
                success: true,
                type: 'analysis',

                status: attributes.status || 'unknown',

                stats: attributes.stats || {
                    malicious: 0,
                    suspicious: 0,
                    undetected: 0,
                    harmless: 0,
                    timeout: 0
                },

                results: attributes.results || {},

                data
            });
        }

        /*
        =====================================================
        ACTION TIDAK DIKENAL
        =====================================================
        */

        return res.status(400).json({
            success: false,
            error:
                'Action tidak valid. Gunakan: url, upload-url, atau analysis.'
        });

    } catch (error) {
        console.error(
            'VirusTotal API Error:',
            error
        );

        return res.status(500).json({
            success: false,
            error:
                error?.message ||
                'Gagal menghubungi VirusTotal.'
        });
    }
}
