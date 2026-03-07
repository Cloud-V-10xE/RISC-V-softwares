(function () {
  // ── Apply theme immediately on <html> to prevent flash ──
  // documentElement exists before <body> so this is safe in <head>
  var root = document.documentElement;
  var savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);

  // ── Everything else waits for full DOM ──
  document.addEventListener("DOMContentLoaded", function () {

    // ── Dark mode toggle ──
    function toggleTheme() {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    }
    document.querySelectorAll(".theme-btn").forEach(function (btn) {
      btn.addEventListener("click", toggleTheme);
    });

    // ── View toggle (grid / list) ──
    var savedView = localStorage.getItem("view") || "grid";

    function applyView(mode) {
      if (mode === "list") {
        document.body.classList.add("list-view");
      } else {
        document.body.classList.remove("list-view");
      }
      localStorage.setItem("view", mode);
      document.querySelectorAll(".view-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.view === mode);
      });
    }

    applyView(savedView);

    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyView(this.dataset.view);
      });
    });

    // ── Search ──
    var input = document.getElementById("pkg-search");
    if (input) {
      input.addEventListener("input", function () {
        var q = this.value.trim().toLowerCase();
        var visible = 0;

        document.querySelectorAll(".pkg-card").forEach(function (card) {
          var name = (card.dataset.name || "").toLowerCase();
          var desc = (card.dataset.desc || "").toLowerCase();
          var cat  = (card.dataset.cat  || "").toLowerCase();
          var match = !q || name.includes(q) || desc.includes(q) || cat.includes(q);
          card.classList.toggle("pkg-hidden", !match);
          if (match) visible++;
        });

        // Hide empty category sections
        document.querySelectorAll(".category-section").forEach(function (section) {
          var hasVisible = section.querySelectorAll(".pkg-card:not(.pkg-hidden)").length > 0;
          section.style.display = hasVisible ? "" : "none";
        });

        var noRes = document.getElementById("no-results");
        if (noRes) noRes.style.display = visible === 0 ? "block" : "none";
      });
    }

  });
})();
