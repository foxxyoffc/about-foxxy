const VT_API = 'https://www.virustotal.com/api/v3';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const apiKey = process.env.VT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'VT_API_KEY belum dikonfigurasi.',
    });
  }

  try {
    const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({
        error: 'URL wajib diisi.',
      });
    }

    const form = new URLSearchParams();

    form.append('url', url);

    const response = await fetch(
      `${VT_API}/urls`,
      {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          'VirusTotal gagal memproses URL.',
      });
    }

    return res.status(200).json({
      success: true,
      analysisId: data?.data?.id,
      data,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Gagal menghubungi VirusTotal.',
    });
  }
}
