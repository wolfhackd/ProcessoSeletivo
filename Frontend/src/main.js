document.getElementById('searchButton').addEventListener('click', async () => {
  const keyword = document.getElementById('keywordInput').value.trim();
  const resultsDiv = document.getElementById('results');

  if (!keyword) {
    alert('Please enter a keyword.');
    return;
  }

  resultsDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(
      `http://localhost:3333/api/scrape?keyword=${encodeURIComponent(keyword)}`,
    );
    if (!response.ok) throw new Error('Request failed');

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

    resultsDiv.innerHTML = data
      .map((product) => {
        return `
          <div class="product">
            <img src="${product.image}" alt="Product Image" />
            <div class="product-info">
              <h3>${product.title}</h3>
              <p>⭐ ${product.rating || 'N/A'} - ${product.reviews || '0'} reviews</p>
            </div>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
  }
});
