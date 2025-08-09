import './index.css';
import { useState } from 'react';

/**
 * App component — Amazon Product Scraper
 *
 * Logical flow (high level):
 * 1. User types a keyword into the controlled input (state `keyword`).
 * 2. User clicks Search -> `handleClick` runs.
 * 3. `handleClick` validates the input, sets a loading state and calls backend API.
 * 4. The response is parsed and we set `results` to either an array of products
 *    or to sentinel strings ('no-results', 'error') which the UI uses for conditional rendering.
 */

export function App() {
  const [results, setResults] = useState(null);
  const [keyword, setKeyword] = useState('');

  // handleClick is an async function that performs input validation and calls the backend.
  const handleClick = async () => {
    if (!keyword.trim()) {
      alert('Please enter a keyword.');
      return;
    }
    // Indicate that a request is in progress so the UI can show feedback.
    setResults('loading');

    try {
      const response = await fetch(
        `http://localhost:3333/api/aceprs?keyword=${encodeURIComponent(keyword)}`,
      );
      if (!response.ok) throw new Error('Request failed');
      const data = await response.json();
      setResults(data.results.length ? data.results : 'no-results');
    } catch (err) {
      console.error(err);
      setResults('error');
    }
  };

  return (
    <div>
      <h1>Amazon Product Scraper</h1>
      <div id="searchBar">
        {/* Controlled input: `value` is bound to state and `onChange` updates state. */}
        <input id="keywordInput" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        {/* Clicking the button triggers the async search flow handled by `handleClick`. */}
        <button id="searchButton" onClick={handleClick}>
          Search
        </button>
      </div>
      <div id="results">
        {/* Conditional rendering using sentinel values stored in `results` */}
        {results === 'loading' && <p>Loading...</p>}
        {results === 'no-results' && <p>No results found.</p>}
        {results === 'error' && <p>Error fetching data. Please try again later.</p>}
        {Array.isArray(results) &&
          results.map((product) => (
            <div className="product" key={product.title}>
              <img src={product.imageUrl} alt="Product Image" />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>
                  ⭐ {product.rating || 'N/A'} - {product.reviews || '0'} reviews
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
