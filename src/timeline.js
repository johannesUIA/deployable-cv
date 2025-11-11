// src/timeline.js

// Data for your projects on the timeline
const timelineProjects = [
  {
    id: "exitnode",
    yearLabel: "2025 · Bachelor project",
    sideLabel: "2025 · BACHELOR PROJECT",
    partial: "src/components/projects/exitnode.html",
  },
  {
    id: "roombooking",
    yearLabel: "2024 · Side project",
    sideLabel: "2024 · SIDE PROJECT",
    partial: "src/components/projects/roombooking.html",
  },
  {
    id: "nested",
    yearLabel: "Aug 2023 · 3rd semester project",
    sideLabel: "AUG 2023 · 3RD SEMESTER",
    partial: "src/components/projects/nøsted.html",
  },
];

// Build the interactive timeline inside #timeline-root
export async function initTimeline() {
  const root = document.getElementById("timeline-root");
  if (!root) return; // projects section not on this page

  // Vertical line
  const lineWrapper = document.createElement("div");
  lineWrapper.className = "absolute left-3 top-0 bottom-0";
  lineWrapper.innerHTML =
    '<div class="h-full w-1.5 bg-white/95 shadow-sm"></div>';
  root.appendChild(lineWrapper);

  // Tracking dot (we move this with JS)
  const tracker = document.createElement("div");
  tracker.id = "timeline-tracker";
  tracker.className =
    "absolute left-3 -ml-[11px] w-6 h-6 rounded-full border-2 border-emerald-400 bg-slate-950 flex items-center justify-center z-40";
  tracker.innerHTML =
    '<div class="w-2 h-2 rounded-full bg-emerald-400"></div>';
  root.appendChild(tracker);

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
      <span class="timeline-bullet absolute -left-[1.08rem] ${
        isNested ? "top-[4.5rem]" : "top-[0.65rem]"
      } block w-3 h-3 rounded-full bg-slate-500"></span>

      <p class="hidden md:block absolute -left-48 top-2 text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
        ${p.sideLabel}
      </p>
      <p class="md:hidden text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase mb-1">
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

    const rootRect = root.getBoundingClientRect();
    const bulletRect = closest.getBoundingClientRect();
    const bulletCenterY = bulletRect.top + bulletRect.height / 2;

    // Position tracker so its center lines up with bullet center,
    // relative to the top of #timeline-root
    const offset = bulletCenterY - rootRect.top;
    tracker.style.top = `${offset - 12}px`; // 12px = half of tracker’s 24px height
  }

  window.addEventListener("scroll", updateTrackerPosition, { passive: true });
  window.addEventListener("resize", updateTrackerPosition);
  updateTrackerPosition(); // initial position
}
