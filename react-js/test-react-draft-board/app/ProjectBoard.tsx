"use client";

import { useState } from "react";
import DraftRow from "./DraftRow";
import { initialProjects, refreshProject } from "./projects";

export default function ProjectBoard() {
  const [projects, setProjects] = useState(initialProjects);

  return (
    <main>
      <header>
        <p className="eyebrow">OPERATIONS / PROJECTS</p>

        <h1>Project drafts</h1>
      </header>

      <div className="toolbar">
        <button id="reverse-order" type="button" onClick={() => setProjects(current => [...current].reverse())}>Reverse order</button>

        <button id="refresh-server" type="button" onClick={() => setProjects(current => current.map(refreshProject))}>Refresh server</button>
      </div>

      <section aria-label="Project editors">
        {projects.map((project, index) => <DraftRow key={index} project={project} />)}
      </section>
    </main>
  );
}
