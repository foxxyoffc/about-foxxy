const VT_API = 'https://www.virustotal.com/api/v3';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'VIRUSTOTAL_API_KEY belum dikonfigurasi di Vercel.',
    });
  }

  try {
    // Dapatkan URL upload dari VirusTotal
    const uploadUrlResponse = await fetch(
      `${VT_API}/files/upload_url`,
      {
        method: 'GET',
        headers: {
          'x-apikey': apiKey,
        },
      }
    );

    const uploadUrlData = await uploadUrlResponse.json();

    if (!uploadUrlResponse.ok) {
      return res.status(uploadUrlResponse.status).json({
        error:
          uploadUrlData?.error?.message ||
          'Gagal mendapatkan upload URL VirusTotal.',
      });
    }

    const uploadUrl = uploadUrlData?.data;

    if (!uploadUrl) {
      return res.status(500).json({
        error: 'Upload URL VirusTotal tidak ditemukan.',
      });
    }

    // Upload file ke VirusTotal
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type':
          req.headers['content-type'] ||
          'application/octet-stream',
      },
      body: req,
      duplex: 'half',
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return res.status(uploadResponse.status).json({
        error:
          uploadData?.error?.message ||
          'Gagal mengupload file ke VirusTotal.',
      });
    }

    return res.status(200).json({
      success: true,
      analysisId: uploadData?.data?.id || null,
      data: uploadData,
    });

  } catch (error) {
    console.error('VirusTotal scan error:', error);

    return res.status(500).json({
      error: 'Gagal menghubungi VirusTotal.',
    });
  }
}
