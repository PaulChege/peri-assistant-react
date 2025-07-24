import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import "@fullcalendar/common/main.css";
// Removed bootstrap5Plugin and Bootstrap CSS import

import periAssistantApi from "../api/periAssistantApi";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      try {
        const response = await periAssistantApi.get("/lessons/user_lessons");
        const lessons = response.data || [];
        const mapped = lessons.map(lesson => {
          const start = lesson.date_time;
          let end = undefined;
          if (lesson.duration && !isNaN(Number(lesson.duration))) {
            const startDate = new Date(start);
            end = new Date(startDate.getTime() + Number(lesson.duration) * 60000).toISOString();
          }
          return {
            title: `${lesson.student?.name || ""}`,
            start,
            end,
            allDay: false
          };
        });
        setEvents(mapped);
      } catch (e) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, []);

  // Force updateSize after mount
  useEffect(() => {
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 100);
  }, []);

  return (
    <div className="container mt-4">
      <style>{`
        /* Add a clear border between days in the week view events section */
        .fc .fc-timegrid-col:not(:last-child) {
          border-right: 2px solid #e0e0e0;
        }
        .fc .fc-timegrid-slot {
          border-right: 2px solid #e0e0e0;
        }
        /* Make day names and numbers consistent with app (not bright blue) */
        .fc .fc-col-header-cell a,
        .fc .fc-col-header-cell {
          color: #222 !important;
          text-decoration: none !important;
        }
        .calendar-responsive {
          overflow-x: auto;
        }
        .calendar-responsive .fc {
          min-width: 0;
        }
      `}</style>
      <div className="card shadow-sm rounded-4 p-4" style={{ background: '#fff', border: 'none' }}>
        <div className="d-flex align-items-center mb-4">
          <h3 className="mb-0 flex-grow-1" style={{ fontWeight: 600 }}>Calendar View</h3>
        </div>
        <div className="calendar-responsive">
          {loading ? (
            <div className="text-center my-5">Loading calendar…</div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              height={600}
              events={events}
              allDaySlot={false}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                list: 'List'
              }}
              datesSet={() => {
                setTimeout(() => {
                  if (calendarRef.current) {
                    calendarRef.current.getApi().updateSize();
                  }
                }, 50);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
} 