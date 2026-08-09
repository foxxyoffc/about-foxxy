const VT_API = 'https://www.virustotal.com/api/v3';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'VIRUSTOTAL_API_KEY belum dikonfigurasi.'
    });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Analysis ID wajib diisi.'
    });
  }

  try {
    const response = await fetch(
      `${VT_API}/analyses/${encodeURIComponent(id)}`,
      {
        headers: {
          'x-apikey': apiKey
        }
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        error: 'Response VirusTotal bukan JSON.'
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error:
          data?.error?.message ||
          'Gagal mengambil hasil scan.'
      });
    }

    const attributes = data?.data?.attributes || {};
    const stats = attributes?.stats || {};

    return res.status(200).json({
      success: true,
      status: attributes.status || 'unknown',
      stats: {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        timeout: stats.timeout || 0
      },
      data
    });

  } catch (error) {
    console.error('SCAN RESULT ERROR:', error);

    return res.status(500).json({
      success: false,
      error: error?.message || 'Gagal mengambil hasil scan.'
    });
  }
}
