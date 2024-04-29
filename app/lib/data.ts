'use server'

import { XMLParser } from 'fast-xml-parser';

interface Sitemap {
    urlset: {
      url: { loc: string; changefreq: string; priority: number }[];
    };
  }

export async function crawl(url: string) {
    console.log(`Crawling ${url}`);

    // fetch the page
    const response = await fetch(url);

    if (!response.ok) {
        console.error(`Failed to fetch ${url}`);
        return;
    }

    const sitemapXML = await response.text();


    // parse the page
    const parser = new XMLParser();
    let sitemap: Sitemap = parser.parse(sitemapXML);

    console.dir(sitemap, { depth: null });
}