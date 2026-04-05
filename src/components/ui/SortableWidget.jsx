import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const SortableWidget = ({ id, children, className = '' }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${className} ${isDragging ? 'opacity-50 scale-105 shadow-2xl relative' : ''}`}>
      <div className="group relative h-full">
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 z-10 p-1"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        {children}
      </div>
    </div>
  );
};
