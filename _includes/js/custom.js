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

jtd.onReady(function () {
  var content = document.getElementById("main-content");

  if (!content) {
    return;
  }

  var imageSizes = {
    "media/add_dependency.gif": [1206, 605],
    "media/antigravity.png": [2782, 1238],
    "media/app-ask-ai-drawer.png": [581, 904],
    "media/app-resource-usage.png": [1059, 230],
    "media/app-sidebar-navigation.png": [224, 520],
    "media/askai_help.gif": [1115, 564],
    "media/askcommunity_help.gif": [1194, 604],
    "media/autohelp.gif": [1118, 607],
    "media/autolaunch-dependencies-combined.png": [1280, 720],
    "media/autolaunch.gif": [1199, 559],
    "media/autolaunch_page.gif": [1223, 572],
    "media/autolaunch_toggle.gif": [1223, 572],
    "media/contextmenu.gif": [1055, 525],
    "media/dependency_launch.gif": [1206, 605],
    "media/dev_detail.png": [1784, 986],
    "media/huggingface-login.png": [1016, 351],
    "media/infobar.png": [2522, 1196],
    "media/logs-help-report.png": [1320, 790],
    "media/mobile-home-footer-nav.png": [390, 844],
    "media/mobileview.gif": [556, 997],
    "media/orchestration-overview.png": [1280, 720],
    "media/phone-access.png": [324, 362],
    "media/phone-codex-auto-terminal.png": [390, 305],
    "media/phone-dev-agents.png": [390, 844],
    "media/phoneview.gif": [500, 1072],
    "media/phoneview.jpg": [390, 825],
    "media/plugins-agent-tools.png": [1290, 720],
    "media/preserve.gif": [1105, 522],
    "media/recursive-dependencies.png": [1280, 720],
    "media/sidebar_toggle.gif": [1060, 532],
    "media/skills-management.png": [1326, 910],
    "media/splitter-modal-redesign.png": [910, 576]
  };

  var hashScrollState = {
    activeUntil: 0,
    interrupted: false,
    resizeObserver: null,
    target: null,
    token: 0
  };

  var normalizeMediaPath = function (src) {
    var match = (src || "").match(/media\/[^?#]+/);
    return match ? match[0] : src;
  };

  var prepareImages = function () {
    Array.prototype.forEach.call(content.querySelectorAll("img"), function (img) {
      var size = imageSizes[normalizeMediaPath(img.getAttribute("src"))];

      if (!size) {
        return;
      }

      if (!img.hasAttribute("width")) {
        img.setAttribute("width", size[0]);
      }

      if (!img.hasAttribute("height")) {
        img.setAttribute("height", size[1]);
      }

      img.decoding = "async";
    });
  };

  var getHashTarget = function () {
    var id = window.location.hash.slice(1);

    if (!id) {
      return null;
    }

    try {
      id = decodeURIComponent(id);
    } catch (error) {
      return null;
    }

    return document.getElementById(id);
  };

  var imageIsBeforeTarget = function (img, target) {
    return Boolean(
      img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
    );
  };

  var alignHashTarget = function () {
    if (
      hashScrollState.interrupted ||
      Date.now() > hashScrollState.activeUntil ||
      !hashScrollState.target
    ) {
      return;
    }

    hashScrollState.target.scrollIntoView({ block: "start" });
  };

  var scheduleAlign = function (delay) {
    var token = hashScrollState.token;

    window.setTimeout(function () {
      if (token === hashScrollState.token) {
        alignHashTarget();
      }
    }, delay);
  };

  var stopResizeObserver = function (token) {
    if (token !== hashScrollState.token || !hashScrollState.resizeObserver) {
      return;
    }

    hashScrollState.resizeObserver.disconnect();
    hashScrollState.resizeObserver = null;
  };

  var startHashScrollCorrection = function () {
    var target = getHashTarget();

    hashScrollState.token += 1;
    hashScrollState.target = target;
    hashScrollState.interrupted = false;
    hashScrollState.activeUntil = Date.now() + 15000;

    if (!target) {
      return;
    }

    [0, 50, 150, 350, 700, 1200, 2000].forEach(scheduleAlign);

    if ("ResizeObserver" in window) {
      if (hashScrollState.resizeObserver) {
        hashScrollState.resizeObserver.disconnect();
      }

      hashScrollState.resizeObserver = new ResizeObserver(function () {
        scheduleAlign(60);
      });
      hashScrollState.resizeObserver.observe(content);
      window.setTimeout(function () {
        stopResizeObserver(hashScrollState.token);
      }, 15000);
    }
  };

  prepareImages();
  startHashScrollCorrection();

  window.addEventListener("hashchange", startHashScrollCorrection);

  ["wheel", "touchstart", "keydown"].forEach(function (eventName) {
    window.addEventListener(
      eventName,
      function () {
        if (Date.now() <= hashScrollState.activeUntil) {
          hashScrollState.interrupted = true;
        }
      },
      { passive: true }
    );
  });

  content.addEventListener(
    "load",
    function (event) {
      if (
        event.target &&
        event.target.tagName === "IMG" &&
        hashScrollState.target &&
        imageIsBeforeTarget(event.target, hashScrollState.target)
      ) {
        scheduleAlign(60);
      }
    },
    true
  );
});
