'use client'

import Link from "next/link";
import { crawl } from '@/app/lib/data';
import { useState } from "react";


export default function Page() {
    const [url, setURL] = useState("https://stephenwalther.com/post-sitemap.xml");


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        crawl(url);
    }

    // handles changes to the URL input field
    function handleURLChange(e:React.ChangeEvent<HTMLInputElement>) {
        setURL(e.target.value);
    }

    return (
        <div>
            <h1>Web Crawler</h1>

            <form onSubmit={handleSubmit}>
                <input type="text" 
                    placeholder="URL" 
                    onChange={handleURLChange}
                    value={url}/> 
                <button type="submit">Crawl</button>
            </form>

        </div>
    );
}