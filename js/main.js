(function() {
  /**
   * Call-to-action slide-down
   */
  let isShowingCTA = false;
  let lastScrollY = 0;
  let waiting = false;
  const hideCTACookie = "hideCTA=true";

  // Detect when the page has been scrolled down a bit
  const scrollHandler = function(e) {
    lastScrollY = window.scrollY;

    if (!waiting) {
      // Debounce
      window.requestAnimationFrame(function() {
        if (isShowingCTA === false && lastScrollY > 300) {
          // Show the CTA
          isShowingCTA = true;
          document.getElementById("cta").classList.add("visible");
        } else if (isShowingCTA && lastScrollY < 10) {
          // Hide the CTA
          isShowingCTA = false;
          document.getElementById("cta").classList.remove("visible");
        }
        waiting = false;
      });
      waiting = true;
    }
  };

  // Handle window scroll events
  if (document.cookie.includes(hideCTACookie) === false) {
    window.addEventListener("scroll", scrollHandler);
  }

  const hideCTAForDays = function(numberOfDays) {
    const millisToHideCTA = numberOfDays * 24 * 60 * 60 * 1000;
    const expireCookieDate = new Date(Date.now() + millisToHideCTA);

    // Prevent it from showing on other pages, for a few days
    document.cookie =
      hideCTACookie + ";expires=" + expireCookieDate.toUTCString() + ";path=/";

    // Hide the CTA
    document.getElementById("cta").classList.remove("visible");

    // Prevent scroll actions from showing the CTA again
    window.removeEventListener("scroll", scrollHandler);
  };

  // Hide the CTA when requested, and don't show it for a number of days
  document.getElementById("no-subscribe").addEventListener("click", function() {
    hideCTAForDays(14);
    // Track "no thanks" clicks
    ga("send", "event", "CTA", "No thanks", "Newsletter");
  });

  // "Sign me up" was clicked!
  document.getElementById("subscribe").addEventListener("click", function() {
    hideCTAForDays(730);
    // Track subscribe clicks
    ga("send", "event", "CTA", "Sign me up", "Newsletter");
  });
})();
