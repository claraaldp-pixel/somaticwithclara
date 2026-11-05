// Site interaction events for Umami. Do not include form values or quiz answers.
(() => {
  const track = (name, data) => {
    if (typeof window.umami?.track === 'function') {
      window.umami.track(name, { page: location.pathname, ...data });
    }
  };

  const placement = element => {
    if (element.closest('.links-offers')) return 'bio-links';
    if (element.closest('footer, .footer, .site-footer, .links-footer')) return 'footer';
    if (element.closest('.site-nav, #mobile-nav, nav')) return 'navigation';
    if (element.closest('.final-call')) return 'final-cta';
    if (element.closest('.masthead, .page-hero, .header')) return 'hero';
    if (element.closest('.offer-card, .detail-card, .platform-card')) return 'card';
    return 'content';
  };

  const isSiteHost = host => host === location.hostname ||
    host === 'www.somaticwithclara.com' || host === 'somaticwithclara.com';

  const destination = url => {
    if (url.protocol === 'mailto:') return 'email';
    if (url.hostname === 'cal.com') {
      if (url.pathname.includes('1-1-somatic-coaching-single-session')) return 'single-session';
      if (url.pathname.includes('60-min-somatic-session-3-months')) return 'three-month-coaching';
      return 'cal-com';
    }
    if (isSiteHost(url.hostname)) {
      const path = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
      return url.hash ? `${path}${url.hash}` : path;
    }
    const known = [
      ['insighttimer.com', 'insight-timer'],
      ['instagram.com', 'instagram'],
      ['youtube.com', 'youtube'],
      ['youtu.be', 'youtube'],
      ['tiktok.com', 'tiktok'],
      ['skool.com', 'skool'],
      ['pensight.com', 'pensight'],
    ];
    return known.find(([host]) => url.hostname === host || url.hostname.endsWith(`.${host}`))?.[1] || 'external-site';
  };

  document.addEventListener('click', event => {
    const element = event.target instanceof Element ? event.target.closest('a, button') : null;
    if (!element || element.hasAttribute('data-umami-event') || element.closest('.ml-embedded')) return;

    const source = placement(element);
    if (element.tagName === 'A') {
      const href = element.getAttribute('href');
      if (!href) return;
      const url = new URL(href, location.href);
      const target = destination(url);
      let name = 'navigation-click';
      if (url.hostname === 'cal.com') name = 'booking-click';
      else if (url.protocol === 'mailto:') name = 'contact-click';
      else if (target === '/is-this-mine') name = 'guide-click';
      else if (url.hash === '#quiz-start') name = 'quiz-start-click';
      else if (!isSiteHost(url.hostname)) name = 'outbound-click';
      track(name, { location: source, destination: target });
      return;
    }

    const action = element.getAttribute('onclick') || '';
    let name = 'button-click';
    if (element.id === 'ham') name = 'menu-toggle';
    else if (element.id === 'next-btn') name = 'quiz-next-click';
    else if (element.id === 'reveal-btn') name = 'quiz-result-request';
    else if (action.includes('retake(')) name = 'quiz-retake';
    else if (action.includes('skipQ(')) name = 'quiz-skip';
    else if (action.includes('openModal(')) name = 'modal-open';
    else if (action.includes('closeModal(')) name = 'modal-close';
    track(name, { location: source, control: element.id || name });
  });

  document.addEventListener('toggle', event => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement) || !details.open) return;
    const kind = details.classList.contains('faq-item') ? 'faq' :
      details.classList.contains('credentials') ? 'credentials' : 'details';
    const index = [...details.parentElement.querySelectorAll('details')].indexOf(details) + 1;
    track('accordion-open', { location: placement(details), kind, item: String(index) });
  }, true);

  document.addEventListener('submit', event => {
    const form = event.target;
    if (form instanceof HTMLFormElement && form.closest('.ml-embedded')) {
      track('guide-form-submit-attempt', { location: 'guide-form' });
    }
  }, true);
})();
