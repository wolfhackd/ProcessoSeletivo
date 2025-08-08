const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/aceprs', async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    const response = await axios.get(url);
    //Talvez eu precise colocar um header aqui tenho que vê os docs

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    const results = Array.from(items).map((item: any) => {
      const title = item.querySelector('h2 span')?.textContent?.trim() || 'N/A';
      const rating =
        item.querySelector('[aria-label*="out of 5 stars"]')?.getAttribute('aria-label') || 'N/A';
      const reviews = item.querySelector('[aria-label*="ratings"]')?.textContent?.trim() || 'N/A';
      const imageUrl = item.querySelector('img')?.getAttribute('src') || 'N/A';

      return { title, rating, reviews, imageUrl };
    });
    res.json({ keyword, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Scraping failed', details: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log('Listen Server');
});
