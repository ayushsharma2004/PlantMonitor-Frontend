import "@/styles/ui/search2.scss"
import profielimg from "@/assets/sirimg.jpg"
import { useState } from "react";

export default function Search2({ message }) {
    const [isActive, setIsActive] = useState(false);

    const handleSearchClick = () => {
        setIsActive(!isActive);
    };

    return (
        <form className={`search_container2 ${isActive ? "active" : ""}`}>
            <span className="searchBtn" onClick={handleSearchClick}>
                <em className={`icon-search ${isActive ? 'searchbtnActive' : ''}`}>
                    <svg
                        id="Layer_1"
                        style={{ enableBackground: "new 0 0 40 40" }}
                        version="1.1"
                        viewBox="0 0 40 40"
                        xmlSpace="preserve"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <g className="st0">
                            <g transform="matrix(1,0,0,1,-35.375,-39.25)">
                                <g transform="matrix(1,0,0,1,53.094,56.437)">
                                    <path className="search1" d="M7.2,9.6c3.8-3,5.9-7.9,5.1-13.2C11.4-9.5,6.7-14.4,0.8-15.3C-8.9-17-17.2-8.7-15.6,1c1,6,6,10.8,12,11.6C-0.8,12.9,4.7,11.7,7.2,9.6"></path>
                                </g>
                            </g>
                            <g transform="matrix(1,0,0,1,-35.375,-39.25)">
                                <g transform="matrix(1,0,0,1,65.866,69.757)">
                                    <path className="searchhandl" d="M8,8.1c0,0-6.1-6-13.3-13"></path>
                                </g>
                            </g>
                            <g transform="matrix(1,0,0,1,-35.375,-39.25)">
                                <g transform="matrix(1,0,0,1,65.866,69.757)">
                                    <path className="searchline1" d="M8,8.1c0,0-16.9-16.6-36.5-35.9"></path>
                                </g>
                            </g>
                            <g transform="matrix(1,0,0,1,-35.375,-39.25)">
                                <g transform="matrix(1,0,0,1,65.866,69.757)">
                                    <path className="searchline2" d="M-28.2,8.4c0,0,16.6-16.9,35.9-36.5"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </em>
            </span>
            <input type="text" placeholder="Search.." />
        </form>
    );
};