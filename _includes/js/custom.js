jtd.onReady(function () {
  var content = document.getElementById("main-content");
  var wrap = document.querySelector(".main-content-wrap");

  if (!content || !wrap) {
    return;
  }

  var sectionNavDepth = Number(window.pinokioSectionNavDepth || 1);
  var headingSelector = sectionNavDepth >= 2
    ? "main > h1[id], main > h2[id]"
    : "main > h1[id]";
  var headings = Array.prototype.slice.call(
    content.querySelectorAll(headingSelector)
  );

  if (headings.length < 2) {
    return;
  }

  var nav = document.createElement("nav");
  nav.className = "section-nav";
  nav.setAttribute("aria-label", "Page sections");

  var label = document.createElement("div");
  label.className = "section-nav-label";
  label.textContent = "Sections";
  nav.appendChild(label);

  var list = document.createElement("ol");
  list.className = "section-nav-list";

  var links = headings.map(function (heading) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    var title = heading.textContent.replace(/\s+/g, " ").trim();
    var level = heading.tagName.toLowerCase();

    item.className = "section-nav-item section-nav-" + level;
    link.href = "#" + heading.id;
    link.textContent = title;
    item.appendChild(link);
    list.appendChild(item);

    return link;
  });

  nav.appendChild(list);
  wrap.insertBefore(nav, content);

  if (!("IntersectionObserver" in window)) {
    return;
  }

  var setActiveLink = function (id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  var visibleSections = {};

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleSections[entry.target.id] = entry.boundingClientRect.top;
        } else {
          delete visibleSections[entry.target.id];
        }
      });

      var active = Object.keys(visibleSections).sort(function (a, b) {
        return visibleSections[a] - visibleSections[b];
      })[0];

      if (active) {
        setActiveLink(active);
      }
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    }
  );

  headings.forEach(function (heading) {
    observer.observe(heading);
  });

  setActiveLink(headings[0].id);
});
