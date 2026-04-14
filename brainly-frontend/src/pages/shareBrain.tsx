    import axios from "axios"
    import { useEffect, useState } from "react"

    import { useParams } from "react-router-dom"
    import { Card } from "../component/card"

    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL


    export const ShareBrain = () => {
        const { shareLink } = useParams()
        const [contents, setContents] = useState<any[]>([])
        const [userName, setUserName] = useState("")
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(true);

        useEffect(() => {
  if (!shareLink){ 
       setError("provide a valid link")
    return};
            async function getContent() {
                try {
                    const res = await axios.get(`${VITE_BACKEND_URL}/brain/${shareLink}`)
                    setUserName(res.data.userName)
                    setContents(res.data.contents)

                } catch {
                    setError("Invalid or expired Link")
                } finally {
                    setLoading(false)
                }
            }

            getContent()
        }, [shareLink])

        if (error) {
            return <p className="text-red-500">{error}</p>;
        }
        if (loading) {
            return <p className="text-gray-400">Loading...</p>;
        }

        return (
            <div className="min-h-screen bg-stone-50 px-8 py-6">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {userName ? `${userName}'s Brain 🧠` : "Shared Brain 🧠"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Public knowledge collection
                    </p>
                </div>

                {/* GRID */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {contents.length === 0 ? (
                        <p className="text-gray-400">No content shared yet</p>
                    ) : contents.map(({ id, type, link, title, summary, tags }) => (
                        <div key={id} className="break-inside-avoid">
                            <Card
                                id={id}
                                type={type}
                                link={link}
                                title={title}
                                summary={summary}
                                tags={tags}
                                showAction={false}
                                onDelete={() => { }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

