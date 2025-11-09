import Navbar from "@/components/Navbar";
import loading_icon from "@/assets/loading.gif";
import { createContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@/styles/studentLanding.css";
import AllStudy from "./AllStudy";
import VideoSearchBar from "@/components/VideoSearchBar";
import VideoSearchBar1 from "@/components/Landing Page/VideoSearchBar1";

export const UpdateDeleteFunc = createContext(null);

export default function StudentLandingNew() {
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [allVideos, setAllVideos] = useState([]);
    const [displayedVideos, setDisplayedVideos] = useState([]);

    const [lastDoc, setLastDoc] = useState(() => {
        const storedStudyVideos = localStorage.getItem("all_study");
        if (storedStudyVideos) {
            let oldStudy = JSON.parse(storedStudyVideos);
            let len = oldStudy?.length;
            oldStudy?.forEach((study, index) => {
                console.log(index, len);
                if (index === len - 1 && len >= 1) {
                    return study;
                }
            });
        } else {
            return false;
        }
    });

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        console.log(storedUser);

        if (storedUser && storedUser !== undefined) {
            console.log(storedUser, 1);

            setIsRegistered(true);
            return JSON.parse(storedUser);
        } else {
            setIsRegistered(false);
            return null;
        }
    });

    const [allStudy, setAllStudy] = useState(() => {
        const storedStudyVideos = localStorage.getItem("all_study");
        if (storedStudyVideos) {
            return JSON.parse(storedStudyVideos);
        } else {
            return [];
        }
    });

    const [forYou, setForYou] = useState(() => {
        const storedForYou = localStorage.getItem("for_you");
        if (storedForYou) {
            return JSON.parse(storedForYou);
        } else {
            return [];
        }
    });
    const navigate = useNavigate();
    var count = 0;

    async function getAllStudy() {
        try {
            setLoading(true);
            console.log(import.meta.env.VITE_API);

            const { data } = await axios.get(
                `${import.meta.env.VITE_API}/api/v1/study/read-all-study`,
                {
                    withCredentials: true,
                }
            );
            console.log("data of all study", data.study);
            console.log(user);

            //   toast.success("All videos are read ")
            setAllVideos(data?.study);
            if (!displayedVideos?.length > 0) {
                setDisplayedVideos(data?.study);
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.loginRequired) {
                navigate("/login-user")
            }
            // toast.error("Some error occured while fetching the Videos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isRegistered || !user) {
            navigate("/login-user");
        } else {
            getAllStudy();
        }
        return () => {
            console.log("Cleanup on component unmount after getting cart items");
        };
    }, []);

    return (
        <div className="main_container">
            <Navbar />
            {loading && (
                <div className="loading_container">
                    <img src={loading_icon} alt="" />
                </div>
            )}
            <div className="secondary_container">
                <div className="student_landing">
                    {!loading ? (
                        <>
                            <div className="landing_search mb-1">
                                <VideoSearchBar displayedVideos={displayedVideos} setDisplayedVideos={setDisplayedVideos} loading={loading} setLoading={setLoading} />
                            </div>

                            <AllStudy
                                loading={loading}
                                setLoading={setLoading}
                                user={user}
                                setUser={setUser}
                                allVideos={displayedVideos}
                                setAllVideos={setDisplayedVideos}
                            />
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
