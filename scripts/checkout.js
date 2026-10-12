(() => {
  const buttons = document.querySelectorAll('[data-checkout-offer]');

  async function beginCheckout(button) {
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = 'Taking you to checkout…';

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer: button.dataset.checkoutOffer })
      });
      const payload = await response.json();
      if (!response.ok || !payload.url) throw new Error(payload.error || 'Checkout could not be started.');
      window.location.assign(payload.url);
    } catch (error) {
      button.disabled = false;
      button.textContent = originalLabel;
      window.alert('Something went wrong opening checkout. Please try again, or email hello@somaticwithclara.com.');
      console.error('Stripe checkout error:', error);
    }
  }

  buttons.forEach((button) => button.addEventListener('click', () => beginCheckout(button)));
})();
