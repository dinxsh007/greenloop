const form = document.getElementById('pickupForm');
const statusBox = document.getElementById('formStatus');
const recentRequestsContainer = document.getElementById('recentRequests');

async function loadRecentRequests() {
  if (!recentRequestsContainer) return;

  try {
    const response = await fetch('/api/requests');
    const requests = await response.json();

    if (!Array.isArray(requests) || requests.length === 0) {
      recentRequestsContainer.innerHTML = '<p class="empty-state">No pickup requests yet. Be the first to schedule a collection.</p>';
      return;
    }

    recentRequestsContainer.innerHTML = requests
      .slice(0, 3)
      .map(
        (request) => `
          <article class="request-item">
            <h4>${request.name}</h4>
            <p><strong>Waste:</strong> ${request.wasteType}</p>
            <p><strong>Quantity:</strong> ${request.quantity}</p>
            <p><strong>Location:</strong> ${request.address}</p>
            <span class="request-badge">${request.status}</span>
          </article>
        `
      )
      .join('');
  } catch (error) {
    recentRequestsContainer.innerHTML = '<p class="empty-state">Unable to load recent requests right now.</p>';
  }
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    statusBox.textContent = 'Submitting your request...';

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }

      statusBox.textContent = result.message || 'Pickup request submitted successfully!';
      form.reset();
      await loadRecentRequests();
    } catch (error) {
      statusBox.textContent = error.message || 'Something went wrong. Please try again.';
    }
  });
}

loadRecentRequests();
