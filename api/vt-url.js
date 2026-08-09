export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed"
        });
    }

    const apiKey =
        process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "VirusTotal API key belum dikonfigurasi."
        });
    }

    try {

        const { url } = req.body || {};

        if (!url) {
            return res.status(400).json({
                error: "URL tidak ditemukan."
            });
        }

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {
            return res.status(400).json({
                error: "URL harus menggunakan HTTP atau HTTPS."
            });
        }


        // =========================
        // SUBMIT URL KE VIRUSTOTAL
        // =========================

        const form = new URLSearchParams();

        form.append("url", url);


        const scanResponse =
            await fetch(
                "https://www.virustotal.com/api/v3/urls",
                {
                    method: "POST",

                    headers: {
                        "x-apikey": apiKey,
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: form.toString()
                }
            );


        const scanData =
            await scanResponse.json();


        if (!scanResponse.ok) {

            return res.status(
                scanResponse.status
            ).json({
                error:
                    scanData?.error?.message ||
                    "VirusTotal gagal melakukan scan.",
                details: scanData
            });
        }


        const analysisId =
            scanData?.data?.id;


        if (!analysisId) {

            return res.status(500).json({
                error:
                    "VirusTotal tidak memberikan Analysis ID."
            });
        }


        // =========================
        // POLLING
        // =========================

        let result = null;


        for (
            let i = 0;
            i < 20;
            i++
        ) {

            await new Promise(
                resolve =>
                    setTimeout(resolve, 3000)
            );


            const analysisResponse =
                await fetch(
                    `https://www.virustotal.com/api/v3/analyses/${encodeURIComponent(analysisId)}`,
                    {
                        headers: {
                            "x-apikey":
                                apiKey
                        }
                    }
                );


            const analysisData =
                await analysisResponse.json();


            if (
                analysisData?.data?.attributes?.status ===
                "completed"
            ) {

                result =
                    analysisData;

                break;
            }
        }


        if (!result) {

            return res.status(202).json({
                pending: true,
                analysisId
            });
        }


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "VT URL Error:",
            error
        );

        return res.status(500).json({
            error:
                "Terjadi kesalahan saat menghubungi VirusTotal."
        });
    }
}
