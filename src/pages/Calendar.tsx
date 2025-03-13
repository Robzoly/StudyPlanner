import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useQuery } from '@tanstack/react-query';
import { getTasks, type Task } from '../lib/tasks';

export default function Calendar() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await getTasks();
      if (error) throw error;
      return data;
    },
  });

  const events = tasks.map((task: Task) => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    backgroundColor:
      task.priority === 'high'
        ? '#ef4444'
        : task.priority === 'medium'
        ? '#f59e0b'
        : '#22c55e',
    borderColor:
      task.priority === 'high'
        ? '#dc2626'
        : task.priority === 'medium'
        ? '#d97706'
        : '#16a34a',
    textColor: '#ffffff',
    extendedProps: {
      category: task.category,
      status: task.status,
    },
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <div className="bg-card rounded-lg p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventContent={(eventInfo) => (
            <div className="p-1">
              <div className="font-medium">{eventInfo.event.title}</div>
              <div className="text-xs">
                {eventInfo.event.extendedProps.category} -{' '}
                {eventInfo.event.extendedProps.status}
              </div>
            </div>
          )}
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </div>
    </div>
  );
}