const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const PORT = process.env.PORT || 3333;

app.get('/api/aceprs', async (req: any, res: any) => {
  const keyword = req.query.keyword as string;

  //Ensures that keyword exists
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }
  //URL
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    // Download HTMl Page
    const response = await axios.get(url);

    //Use JSOM to extract HTML items
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    //Select the div with all items
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    //Transforming the list of items into an Array to send via the API to the front end
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
