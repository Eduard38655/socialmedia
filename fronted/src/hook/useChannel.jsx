import { useEffect, useState } from "react";

export function useChannels(groupid, setGroup_Name) {
    const [sections, setSections] = useState([]);
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        if (!groupid) {
            console.log("groupid undefined, skip fetch"); // confirma el problema
            return;
        }

        const fetchChannels = async () => {
            try {

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/private/channel_members/${groupid}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await res.json();


                const workspace = data?.data?.[0];
                const channelSections = workspace?.channel_sections || [];

                setSections(channelSections);

                // abrir todas las secciones por defecto
                const initialOpenState = {};
                channelSections.forEach((section) => {
                    initialOpenState[section.sectionid] = true;
                });
                setOpenSections(initialOpenState);

                if (workspace?.name) {
                    setGroup_Name((prev) => ({
                        ...prev,
                        group: workspace.name,
                    }));
                }
            } catch (err) {
                console.error("Error cargando canales:", err);
            }
        };



        fetchChannels();
    }, [groupid, setGroup_Name]);

    return {
        sections,
        setSections,
        openSections,
        setOpenSections,
    };
}