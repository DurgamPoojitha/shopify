document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.zip-pricing-container');
  if (!container) return;

  const apiUrl = container.dataset.apiUrl;
  const productId = container.dataset.productId;
  const variantId = container.dataset.variantId;

  const input = document.getElementById('zipcode-input');
  const submitBtn = document.getElementById('zipcode-submit');
  const errorContainer = document.getElementById('zip-pricing-error');
  const resultContainer = document.getElementById('zip-pricing-result');
  const loader = document.getElementById('zip-pricing-loader');
  const successContainer = document.getElementById('zip-pricing-success');
  const amountDisplay = document.getElementById('zip-pricing-amount');

  // Format price helper (assuming USD, can be dynamic based on shop currency in a real app)
  const formatMoney = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(cents);
  };

  const showError = (message) => {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    resultContainer.style.display = 'none';
  };

  const clearError = () => {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  };

  const fetchPrice = async () => {
    const zipCode = input.value.trim();

    // Validation
    if (!zipCode) {
      showError('ZIP code is required');
      return;
    }

    if (!/^\d{5}$/.test(zipCode)) {
      showError('Please enter a valid 5-digit ZIP code');
      return;
    }

    clearError();
    
    // UI Loading state
    submitBtn.disabled = true;
    resultContainer.style.display = 'block';
    loader.style.display = 'flex';
    successContainer.style.display = 'none';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          productId,
          variantId,
          zipCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch price');
      }

      // Display result
      loader.style.display = 'none';
      amountDisplay.textContent = formatMoney(data.price);
      successContainer.style.display = 'flex';

    } catch (error) {
      console.error('ZIP Pricing Error:', error);
      showError(error.message || 'Network error or unknown failure');
      loader.style.display = 'none';
      resultContainer.style.display = 'none';
    } finally {
      submitBtn.disabled = false;
    }
  };

  // Event Listeners
  submitBtn.addEventListener('click', fetchPrice);
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchPrice();
    }
  });

  // Only allow numbers
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
  });
});
