export default async function handler(req, res) {
    // ==============================
    // CORS
    // ==============================
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan."
        });
    }

    // ==============================
    // API KEY
    // ==============================
    const API_KEY = process.env.VIRUSTOTAL_API_KEY;

    if (!API_KEY) {
        console.error("VIRUSTOTAL_API_KEY belum diset.");

        return res.status(500).json({
            success: false,
            message: "VirusTotal API belum dikonfigurasi di server."
        });
    }

    try {
        // ==============================
        // AMBIL URL
        // ==============================
        const { url } = req.body || {};

        if (!url || typeof url !== "string") {
            return res.status(400).json({
                success: false,
                message: "URL tidak valid."
            });
        }

        let targetUrl = url.trim();

        // Tambahkan https:// jika user tidak memasukkannya
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = "https://" + targetUrl;
        }

        // Validasi URL
        let parsedUrl;

        try {
            parsedUrl = new URL(targetUrl);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Format URL tidak valid."
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                message: "Hanya URL HTTP atau HTTPS yang diperbolehkan."
            });
        }

        targetUrl = parsedUrl.href;

        console.log("VirusTotal scan:", targetUrl);

        // ==============================
        // SUBMIT URL KE VIRUSTOTAL
        // ==============================
        const formData = new URLSearchParams();
        formData.append("url", targetUrl);

        const scanResponse = await fetch(
            "https://www.virustotal.com/api/v3/urls",
            {
                method: "POST",
                headers: {
                    "x-apikey": API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            }
        );

        const scanData = await scanResponse.json();

        if (!scanResponse.ok) {
            console.error("VirusTotal scan error:", scanData);

            return res.status(scanResponse.status).json({
                success: false,
                message:
                    scanData?.error?.message ||
                    "Gagal mengirim URL ke VirusTotal."
            });
        }

        const analysisId = scanData?.data?.id;

        if (!analysisId) {
            return res.status(500).json({
                success: false,
                message: "VirusTotal tidak mengembalikan Analysis ID."
            });
        }

        // ==============================
        // CEK STATUS ANALYSIS
        // Maksimal beberapa kali agar
        // tidak terlalu banyak request
        // ==============================
        let analysisData = null;

        for (let attempt = 0; attempt < 3; attempt++) {
            // Tunggu sebentar sebelum mengambil hasil
            await new Promise(resolve =>
                setTimeout(resolve, attempt === 0 ? 2500 : 3000)
            );

            const analysisResponse = await fetch(
                `https://www.virustotal.com/api/v3/analyses/${encodeURIComponent(analysisId)}`,
                {
                    method: "GET",
                    headers: {
                        "x-apikey": API_KEY
                    }
                }
            );

            const data = await analysisResponse.json();

            if (!analysisResponse.ok) {
                console.error("VirusTotal analysis error:", data);

                return res.status(analysisResponse.status).json({
                    success: false,
                    message:
                        data?.error?.message ||
                        "Gagal mengambil hasil analisis VirusTotal."
                });
            }

            analysisData = data;

            const status =
                data?.data?.attributes?.status;

            console.log(
                `Analysis attempt ${attempt + 1}:`,
                status
            );

            if (status === "completed") {
                break;
            }
        }

        // ==============================
        // DATA HASIL
        // ==============================
        const attributes =
            analysisData?.data?.attributes || {};

        const stats = attributes.stats || {};

        const malicious = Number(stats.malicious || 0);
        const suspicious = Number(stats.suspicious || 0);
        const harmless = Number(stats.harmless || 0);
        const undetected = Number(stats.undetected || 0);

        // ==============================
        // AMBIL ENGINE YANG MENDETEKSI
        // ==============================
        const results = attributes.results || {};

        const detections = Object.values(results)
            .filter(item =>
                item &&
                ["malicious", "suspicious"].includes(item.category)
            )
            .map(item => ({
                engine: item.engine_name || "Unknown",
                category: item.category,
                result: item.result || null,
                method: item.method || null
            }));

        // ==============================
        // BUAT STATUS
        // ==============================
        let status = "safe";
        let statusText = "Website Aman";

        if (malicious > 0) {
            status = "danger";
            statusText = "Website Berbahaya";
        } else if (suspicious > 0) {
            status = "warning";
            statusText = "Website Mencurigakan";
        }

        // ==============================
        // URL REPORT VIRUSTOTAL
        // ==============================
        const urlId = Buffer
            .from(targetUrl)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        const reportUrl =
            `https://www.virustotal.com/gui/url/${urlId}`;

        // ==============================
        // RESPONSE KE FRONTEND
        // ==============================
        return res.status(200).json({
            success: true,

            url: targetUrl,

            status,
            statusText,

            analysisStatus:
                attributes.status || "unknown",

            stats: {
                malicious,
                suspicious,
                harmless,
                undetected
            },

            detections,

            totalDetections: detections.length,

            analysisId,

            reportUrl
        });

    } catch (error) {
        console.error("CHECK WEB ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
}
