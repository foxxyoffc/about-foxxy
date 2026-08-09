const VT_API = 'https://www.virustotal.com/api/v3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  const { id } = req.query;

  if (!apiKey) {
    return res.status(500).json({
      error: 'VIRUSTOTAL_API_KEY belum dikonfigurasi di Vercel.',
    });
  }

  if (!id) {
    return res.status(400).json({
      error: 'Analysis ID wajib diisi.',
    });
  }

  try {
    const response = await fetch(
      `${VT_API}/analyses/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          'x-apikey': apiKey,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          'Gagal mengambil hasil scan VirusTotal.',
      });
    }

    return res.status(200).json({
      success: true,
      data: data.data,
    });

  } catch (error) {
    console.error('Analysis error:', error);

    return res.status(500).json({
      error: 'Gagal menghubungi VirusTotal.',
    });
  }
}
