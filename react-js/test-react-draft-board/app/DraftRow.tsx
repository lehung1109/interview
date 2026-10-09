"use client";

import { useEffect, useState } from "react";
import type { Project } from "./projects";

export default function DraftRow({ project }: Readonly<{ project: Project }>) {
  const [draft, setDraft] = useState(project.title);
  const [checks, setChecks] = useState(0);
  const [lastChecked, setLastChecked] = useState("No draft checked yet.");
  const dirty = draft !== project.title;
  const settings = { delay: 250 };

  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      setChecks(current => current + 1);
      setLastChecked(draft);
    }, settings.delay);
    return () => clearTimeout(timer);
  }, [draft, dirty, settings]);

  return (
    <article className="project-row" data-project-id={project.id} data-dirty={dirty}>
      <label className="project-title" htmlFor={`draft-${project.id}`}>{project.title}</label>

      <div className="editor-line">
        <input id={`draft-${project.id}`} className="draft-input" value={draft} onChange={event => setDraft(event.target.value)} aria-describedby={`status-${project.id}`} />

        <button className="discard" type="button" data-action="discard" onClick={() => setDraft(project.title)}>Discard</button>
      </div>

      <div className="metadata">
        <output id={`status-${project.id}`} className="draft-status">{dirty ? "Unsaved draft" : "Up to date"}</output>

        <span>Draft checks: <output className="draft-checks">{checks}</output></span>

        <span>Server revision: {project.revision}</span>
      </div>

      <p className="last-check">Last checked: <span className="last-checked">{lastChecked}</span></p>
    </article>
  );
}
