const VT_API = 'https://www.virustotal.com/api/v3';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    let body = req.body;

    // Vercel kadang memberikan body sebagai string
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Request body bukan JSON yang valid.'
        });
      }
    }

    const url = body?.url?.trim();

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL wajib diisi.'
      });
    }

    // Validasi URL
    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'URL tidak valid.'
      });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        error: 'URL harus menggunakan HTTP atau HTTPS.'
      });
    }

    /*
     * Kirim URL ke VirusTotal
     */
    const form = new URLSearchParams();
    form.append('url', url);

    const vtResponse = await fetch(`${VT_API}/urls`, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    });

    const vtText = await vtResponse.text();

    let vtData;

    try {
      vtData = JSON.parse(vtText);
    } catch {
      console.error('VirusTotal response:', vtText);

      return res.status(502).json({
        success: false,
        error: 'VirusTotal mengembalikan response yang tidak valid.'
      });
    }

    if (!vtResponse.ok) {
      return res.status(vtResponse.status).json({
        success: false,
        error:
          vtData?.error?.message ||
          'VirusTotal gagal memproses URL.',
        details: vtData
      });
    }

    const analysisId = vtData?.data?.id;

    if (!analysisId) {
      return res.status(502).json({
        success: false,
        error: 'VirusTotal tidak memberikan Analysis ID.'
      });
    }

    return res.status(200).json({
      success: true,
      analysisId
    });

  } catch (error) {
    console.error('SCAN FILE ERROR:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'Gagal menghubungi VirusTotal.'
    });
  }
}
