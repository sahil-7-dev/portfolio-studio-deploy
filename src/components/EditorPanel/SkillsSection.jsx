import React, { useState } from 'react';
import {
  DndContext, PointerSensor, useSensor, useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, arrayMove,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { uid } from '../../data/defaults.js';

function Chip({ id, label, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`chip ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <span className="chip-drag-handle" aria-hidden="true">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor"><circle cx="2" cy="2" r="1"/><circle cx="6" cy="2" r="1"/><circle cx="2" cy="6" r="1"/><circle cx="6" cy="6" r="1"/><circle cx="2" cy="10" r="1"/><circle cx="6" cy="10" r="1"/></svg>
      </span>
      <span>{label}</span>
      <button
        type="button"
        className="chip-remove"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={`Remove ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 1l8 8M9 1l-8 8" />
        </svg>
      </button>
    </div>
  );
}

export default function SkillsSection({ skills, onChange }) {
  const [draft, setDraft] = useState('');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const add = (raw) => {
    const label = String(raw || '').trim();
    if (!label) return;
    if (skills.some((s) => s.label.toLowerCase() === label.toLowerCase())) return;
    onChange([...skills, { id: uid(), label }]);
  };

  const remove = (id) => onChange(skills.filter((s) => s.id !== id));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && !draft && skills.length) {
      onChange(skills.slice(0, -1));
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = skills.findIndex((s) => s.id === active.id);
    const newIndex = skills.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(skills, oldIndex, newIndex));
  };

  return (
    <div className="field">
      <label className="field-label">Skills · press Enter to add · drag to reorder</label>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={skills.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
          <div className="tag-input">
            {skills.map((s) => (
              <Chip key={s.id} id={s.id} label={s.label} onRemove={() => remove(s.id)} />
            ))}
            <input
              className="tag-input-field"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => { if (draft) { add(draft); setDraft(''); } }}
              placeholder={skills.length ? 'Add another…' : 'TypeScript, Rust, React…'}
            />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
