"use client";

import { useEffect, useState } from "react";
import type { Project } from "./projects";

export default function DraftRow({ project }: Readonly<{ project: Project }>) {
  const [editor, setEditor] = useState({
    revision: project.revision,
    title: project.title,
    dirty: false,
  });
  const [checks, setChecks] = useState(0);
  const [lastChecked, setLastChecked] = useState("No draft checked yet.");

  if (editor.revision !== project.revision) {
    setEditor({
      revision: project.revision,
      title: editor.dirty ? editor.title : project.title,
      dirty: editor.dirty,
    });
  }

  const draft = editor.title;
  const dirty = editor.dirty;

  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      setChecks(current => current + 1);
      setLastChecked(draft);
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, dirty]);

  return (
    <article className="project-row" data-project-id={project.id} data-dirty={dirty}>
      <label className="project-title" htmlFor={`draft-${project.id}`}>{project.title}</label>

      <div className="editor-line">
        <input
          id={`draft-${project.id}`}
          className="draft-input"
          value={draft}
          onChange={event => setEditor({
            revision: project.revision,
            title: event.target.value,
            dirty: event.target.value !== project.title,
          })}
          aria-describedby={`status-${project.id}`}
        />

        <button
          className="discard"
          type="button"
          data-action="discard"
          onClick={() => setEditor({ revision: project.revision, title: project.title, dirty: false })}
        >
          Discard
        </button>
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
