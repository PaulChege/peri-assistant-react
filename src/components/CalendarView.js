import React, { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/common/main.css";

import { useNavigate } from "react-router-dom";
import periAssistantApi from "../api/periAssistantApi";                                               

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

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
            id: lesson.id,
            title: `${lesson.student?.name || ""}`,
            start,
            end,
            allDay: false,
            lessonData: lesson // Store the full lesson data for API calls
          };
        });
        setEvents(mapped);
        
        // Force calendar to update size after events are loaded
        setTimeout(() => {
          if (calendarRef.current) {
            calendarRef.current.getApi().updateSize();
          }
        }, 100);
        
        // Additional updateSize call for refresh scenarios
        setTimeout(() => {
          if (calendarRef.current) {
            calendarRef.current.getApi().updateSize();
          }
        }, 200);
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

  // Handle event drop (dragging to new time/date)
  const handleEventDrop = async (dropInfo) => {
    const { event } = dropInfo;
    const lessonData = event.extendedProps.lessonData;
    
    try {
      const newDateTime = event.start.toISOString();
      await periAssistantApi.put(
        `/students/${lessonData.student.id}/lessons/${lessonData.id}`,
        {
          lesson: {
            date_time: newDateTime
          }
        }
      );
    } catch (error) {
      console.error("Failed to update lesson time:", error);
      // Revert the event to its original position
      dropInfo.revert();
    }
  };

  // Handle event resize (changing duration)
  const handleEventResize = async (resizeInfo) => {
    const { event } = resizeInfo;
    const lessonData = event.extendedProps.lessonData;
    
    try {
      // Calculate new duration in minutes
      const startTime = event.start;
      const endTime = event.end;
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      
      await periAssistantApi.put(
        `/students/${lessonData.student.id}/lessons/${lessonData.id}`,
        {
          lesson: {
            duration: durationMinutes
          }
        }
      );
    } catch (error) {
      console.error("Failed to update lesson duration:", error);
      // Revert the event to its original size
      resizeInfo.revert();
    }
  };

  // Handle day navigation link click
  const handleNavLinkDayClick = (dayClickInfo) => {
    // Change to day view and navigate to the clicked date
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay', dayClickInfo);
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    const lessonData = clickInfo.event.extendedProps.lessonData;
    // Navigate to the lesson edit page
    navigate(`/student/${lessonData.student.id}/lesson/${lessonData.id}/edit`);
  };

  // Handle today button click - always navigate to today
  const handleTodayClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  return (
    <div className="container mt-4" style={{ padding: '20px' }}>
      <style>{`
        /* Make day names and numbers consistent with app (not bright blue) */
        .fc .fc-col-header-cell a,
        .fc .fc-col-header-cell {
          color: #222 !important;
          text-decoration: none !important;
        }
        .fc {
          width: 100% !important;
        }
      `}</style>
      <h4>Calendar</h4>
      {loading ? (
        <div className="text-center my-5">Loading calendar…</div>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          height={600}
          events={events}
          allDaySlot={false}
          editable={true}
          eventStartEditable={true}
          eventDurationEditable={true}
          handleWindowResize={true}
          windowResizeDelay={100}
          navLinks={true}
          navLinkDayClick={handleNavLinkDayClick}
          nowIndicator={true}
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
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
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
  );
} 