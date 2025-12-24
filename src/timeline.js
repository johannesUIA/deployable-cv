// src/timeline.js

// Data for your projects on the timeline
const timelineProjects = [
  {
    id: "github-stats",
    yearLabel: "2025 · Learning cadence",
    sideLabel: "NOW",
    partial: "src/components/projects/github-stats.html",
  },
  {
    id: "exitnode",
    yearLabel: "2025 · Bachelor project",
    sideLabel: "Jan 2025",
    partial: "src/components/projects/exitnode.html",
  },
  {
    id: "roombooking",
    yearLabel: "2024 · Side project",
    sideLabel: "AUG 2024",
    partial: "src/components/projects/roombooking.html",
  },
  {
    id: "unn",
    yearLabel: "2024-2025 · Summer job",
    sideLabel: "JAN 2024",
    partial: "src/components/projects/unn.html",
  },
  {
    id: "nito",
    yearLabel: "2024 · NITO deputy chair",
    sideLabel: "JAN 2024",
    partial: "src/components/projects/nito.html",
  },
  {
    id: "nøsted",
    yearLabel: "Aug 2023 · 3rd semester project",
    sideLabel: "AUG 2023",
    partial: "src/components/projects/nøsted.html",
  },
];

// Build the interactive timeline inside #timeline-root
export async function initTimeline() {
  const root = document.getElementById("timeline-root");
  if (!root) return; // projects section not on this page

  // Vertical line — render as a fixed element flush to the viewport left edge
  const lineWrapper = document.createElement("div");
  // Make the vertical line fixed and span the full viewport height so it's
  // always visible at the outer left (like the inspirational image).
  lineWrapper.className = "fixed left-14 top-0 bottom-0 z-20";
  lineWrapper.innerHTML =
    '<div class="h-full w-[1.5px] bg-white shadow-sm"></div>';
  lineWrapper.style.pointerEvents = "none";
  // start hidden until the timeline section enters the viewport
  lineWrapper.style.opacity = "0";
  lineWrapper.style.transition = "opacity 220ms ease";
  document.body.appendChild(lineWrapper);
  // ensure the inner line is explicitly white and visible
  const _lineInner = lineWrapper.querySelector("div");
  if (_lineInner) {
    _lineInner.style.backgroundColor = "#ffffff";
    _lineInner.style.height = "100vh";
  }

  // Tracking dot (we move this with JS) — render fixed so it can align with the fixed line
  const tracker = document.createElement("div");
  tracker.id = "timeline-tracker";
  tracker.className =
    "fixed left-14 -ml-[11px] w-6 h-6 rounded-full border-2 border-emerald-400 bg-slate-950 flex items-center justify-center z-40";
  tracker.innerHTML =
    '<div class="w-2 h-2 rounded-full bg-emerald-400"></div>';
  tracker.style.pointerEvents = "none";
  tracker.style.opacity = "0";
  tracker.style.transition = "opacity 220ms ease";
  document.body.appendChild(tracker);

  // List container
  const list = document.createElement("ol");
  list.className = "relative pl-10 space-y-24"; // extra space between items
  root.appendChild(list);

  // Build each project item
  for (let i = 0; i < timelineProjects.length; i++) {
    const p = timelineProjects[i];
    const li = document.createElement("li");
    li.className = "relative";

    const isNested = p.id === "nested"; // special-case Nøsted bullet offset

    li.innerHTML = `
      <span class="timeline-bullet absolute -left-[1.08rem] top-1/2 -translate-y-1/2 block w-3 h-3 rounded-full bg-slate-500"></span>


      <p class="hidden md:block absolute left-4 top-2 text-sm font-extrabold tracking-[0.25em] text-white uppercase">
        ${p.sideLabel}
      </p>
      <p class="md:hidden text-[11px] font-extrabold tracking-[0.25em] text-white uppercase mb-1">
        ${p.yearLabel}
      </p>

      <div id="project-${p.id}" class="space-y-2"></div>
    `;

    list.appendChild(li);

    // Load the HTML partial for this project
    const res = await fetch(p.partial);
    const html = await res.text();
    const target = document.getElementById(`project-${p.id}`);
    if (target) {
      target.innerHTML = html;
    }
  }

  // === Scroll tracking for the green dot ===
  const bullets = list.querySelectorAll(".timeline-bullet");

  // Align timeline bullets horizontally to match the fixed line position.
  function alignBulletsToLine() {
    const lineInner = lineWrapper.querySelector("div");
    if (!lineInner) return;
    const lineRect = lineInner.getBoundingClientRect();
    const lineCenterX = lineRect.left + lineRect.width / 2;

    bullets.forEach((b) => {
      const li = b.closest("li");
      if (!li) return;
      const liRect = li.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      const bCenterY = bRect.top + bRect.height / 2;
      // Compute left offset inside the li so the bullet centers on the fixed line
      const leftInLi = lineCenterX - liRect.left - b.offsetWidth / 2;
      b.style.left = `${leftInLi}px`;
      // ensure bullet remains absolutely positioned relative to li
      b.style.position = "absolute";
      // Move the desktop side label to the left of the line as well
      const desktopLabel = li.querySelector('p.hidden');
      if (desktopLabel) {
        const gap = 24; // px gap between label and line
        const labelWidth = desktopLabel.offsetWidth || 0;
        const leftForLabel = lineCenterX + gap - liRect.left;
        desktopLabel.style.left = `${leftForLabel}px`;
        desktopLabel.style.position = "absolute";
        desktopLabel.style.textAlign = "left";

        // vertically center the label to the bullet/point
        const labelHeight = desktopLabel.offsetHeight || 0;
        const topForLabel = bCenterY - liRect.top - labelHeight / 2;
        desktopLabel.style.top = `${topForLabel}px`;
      }
    });
  }

  function updateTrackerPosition() {
    if (!bullets.length) return;

    const viewportCenter = window.innerHeight / 2;
    let closest = null;
    let closestDist = Infinity;

    bullets.forEach((b) => {
      const rect = b.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const dist = Math.abs(centerY - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = b;
      }
    });

    if (!closest) return;

    const bulletRect = closest.getBoundingClientRect();
    const bulletCenterY = bulletRect.top + bulletRect.height / 2;

    // Tracker is fixed, so set top to the bullet center in viewport coordinates
    tracker.style.top = `${bulletCenterY - 12}px`; // 12px = half of tracker’s 24px height
  }

  // Initial alignment and tracker position
  alignBulletsToLine();
  updateTrackerPosition();
  // Show the fixed line & tracker when the ABOUT section is out of view.
  // If #about is not present, fall back to observing the timeline root.
  const aboutEl = document.getElementById("history");
  const visibilityTarget = aboutEl || root;

  const observer = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      // When the observed element is NOT intersecting the viewport,
      // reveal the timeline; hide it again when the element is visible.
      if (e && !e.isIntersecting) {
        lineWrapper.style.opacity = "1";
        tracker.style.opacity = "1";
        alignBulletsToLine();
        updateTrackerPosition();
      } else {
        lineWrapper.style.opacity = "0";
        tracker.style.opacity = "0";
      }
    },
    { root: null, threshold: 0 }
  );

  observer.observe(visibilityTarget);

  // Recompute on resize (root position/size may change)
  window.addEventListener("resize", () => {
    alignBulletsToLine();
    updateTrackerPosition();
  });

  // Update tracker while scrolling (bullets move in viewport)
  window.addEventListener("scroll", updateTrackerPosition, { passive: true });
}
