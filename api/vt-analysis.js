export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "VirusTotal API key belum dikonfigurasi."
        });
    }

    const analysisId = req.query.id;

    if (!analysisId) {
        return res.status(400).json({
            error: "Analysis ID tidak ditemukan."
        });
    }

    try {
        const response = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${encodeURIComponent(analysisId)}`,
            {
                headers: {
                    "x-apikey": apiKey
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || "Gagal mengambil hasil analisis.",
                details: data
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("VT Analysis Error:", error);

        return res.status(500).json({
            error: "Gagal mengambil hasil dari VirusTotal."
        });
    }
}
