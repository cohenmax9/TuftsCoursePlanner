$(document).ready(function() {

   var $calendar = $('#calendar');
   var id = 10;

   $calendar.weekCalendar({
      timeslotsPerHour : 4,
      timeslotHeight : 25,
      //showHeader : false,
      buttons : false,
      allowCalEventOverlap : true,
      overlapEventsSeparate: true,
      firstDayOfWeek : 1,
      readOnly : true,
      businessHours :{start: 8, end: 23, limitDisplay: true },
      daysToShow : 5,
      dateFormat : "",
      height : function($calendar) {
         return 1533;//$(window).height(); - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#aaa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      draggable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      resizable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      eventNew : function(calEvent, $event) {
        
      },/*function(calEvent, $event) {
         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         var titleField = $dialogContent.find("input[name='title']");
         var bodyField = $dialogContent.find("textarea[name='body']");


         $dialogContent.dialog({
            modal: true,
            title: "New Calendar Event",
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {
                  calEvent.id = id;
                  id++;
                  calEvent.start = new Date(startField.val());
                  calEvent.end = new Date(endField.val());
                  calEvent.title = titleField.val();
                  calEvent.body = bodyField.val();

                  $calendar.weekCalendar("removeUnsavedEvents");
                  $calendar.weekCalendar("updateEvent", calEvent);
                  $dialogContent.dialog("close");
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));

      },*/
      eventDrop : function(calEvent, $event) {      
      },
      eventResize : function(calEvent, $event) {
      },
      eventClick : function(calEvent, $event) {
         var description = document.getElementById("cal_event_onclick");

         for (var i = 0; i < description.childNodes.length; i++) {      //If the course is already displayed, then close it
            if (description.children[i].id == calEvent.course_id) {
               var to_remove = document.getElementById(description.children[i].id);
               description.removeChild(to_remove);
               return;
            }
         }

         var data = getEventData(ajaxCallback).events;

         var course = document.createElement("div");
         course.setAttribute("id", calEvent.course_id);
         course.setAttribute("class", "course_description");
         course.setAttribute("onclick", "removeCourseDescription(" + calEvent.course_id + ")");

         var title = document.createElement("p");
         title.innerHTML = "Course Name: " + calEvent.title;
         var instructor = document.createElement("p");
         instructor.innerHTML = "Instructor: " + calEvent.instructor;
         var room = document.createElement("p");
         room.innerHTML = "Room: " + calEvent.room;
         var dept_course_num = document.createElement("p");
         dept_course_num.innerHTML = "Course Number: " + calEvent.dept_course_num;
         var course_id = document.createElement("p");
         course_id.innerHTML = "Course ID: " + calEvent.course_id;
         var meeting_time = document.createElement("p");
         meeting_time.innerHTML = "Meeting Time: " + parseMeetingTime(calEvent, data);

         course.appendChild(title);
         course.appendChild(dept_course_num);
         course.appendChild(course_id);
         course.appendChild(meeting_time);
         course.appendChild(room);
         course.appendChild(instructor);

         description.insertBefore(course, description.firstChild);

         //Create some sort of pop up here to display all of the information of the course

/*
         if (calEvent.readOnly) {
            return;
         }

         var $dialogContent = $("#event_edit_container");
         resetForm($dialogContent);
         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         var titleField = $dialogContent.find("input[name='title']").val(calEvent.title);
         var bodyField = $dialogContent.find("textarea[name='body']").val(calEvent);
         bodyField.val(calEvent.body);

         $dialogContent.dialog({
            modal: true,
            title: "Edit - " + calEvent.title,
            close: function() {
               $dialogContent.dialog("destroy");
               $dialogContent.hide();
               $('#calendar').weekCalendar("removeUnsavedEvents");
            },
            buttons: {
               save : function() {

                  calEvent.start = new Date(startField.val());
                  calEvent.end = new Date(endField.val());
                  calEvent.title = titleField.val();
                  calEvent.body = bodyField.val();

                  $calendar.weekCalendar("updateEvent", calEvent);
                  $dialogContent.dialog("close");
               },
               "delete" : function() {
                  $calendar.weekCalendar("removeEvent", calEvent.id);
                  $dialogContent.dialog("close");
               },
               cancel : function() {
                  $dialogContent.dialog("close");
               }
            }
         }).show();

         var startField = $dialogContent.find("select[name='start']").val(calEvent.start);
         var endField = $dialogContent.find("select[name='end']").val(calEvent.end);
         $dialogContent.find(".date_holder").text($calendar.weekCalendar("formatDate", calEvent.start));
         setupStartAndEndTimeFields(startField, endField, calEvent, $calendar.weekCalendar("getTimeslotTimes", calEvent.start));
         $(window).resize().resize(); //fixes a bug in modal overlay size ??
*/
      },
      eventMouseover : function(calEvent, $event) {
      },
      eventMouseout : function(calEvent, $event) {
      },
      noEvents : function() {
      },
      data : function(start, end, callback) {
         callback(getEventData(ajaxCallback));
      }
   });

   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }

   function getEventData(callback) {
      var result;

      $.ajax({
         type: "GET",
         dataType: "text",
         url: "http://localhost:3000/sendcart",
         async: false,
         data: {},
         success: function (schedule) {
            result = callback(schedule);
         },
         error: function () { console.log("Cant get cart"); }
      });

      return result;
   }

   function ajaxCallback(data) {    //Allows for the ajax get in getEventData() to finish before returning the data to the callback in line 143
      var parsed_schedule = JSON.parse(data);
      var data_to_send = {"events": parsed_schedule.courses};
      return data_to_send;
   }

   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");

   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $(this).find(":selected").val();
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
         $endTimeOptions.filter(function() {
            return startTime < $(this).val();
         })
      );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });

      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   });

   function parseMeetingTime(calEvent, data)
   {
      var start_string = calEvent.start.toString();
      var end_string = calEvent.end.toString();

      var days_of_week = getDaysOfCourse(calEvent.course_id, data);
      var start_time = readableTime(start_string.substring(16, 21));
      var end_time = readableTime(end_string.substring(16, 21));

      var date_string = days_of_week + " " + start_time + " to " + end_time;

      return date_string;
   }

   function getDaysOfCourse(course_id, data) 
   {
      var days_of_week = "";

      for (var i = 0; i < data.length; i++) {
         if (data[i].course_id == course_id) {
            days_of_week += data[i].day;
         }
      }

      return days_of_week;
   }

   function readableTime(time)
   {
      var hour = time.substring(0, 2); 
      var min = time.substring(3, 6);

      if (hour > 12) {
         hour -= 12;
         return hour + ":" + min + "pm";
      }

      return hour + ":" + min + "am";
   }

/*
   var $about = $("#about");

   $("#about_button").click(function() {
      $about.dialog({
         title: "About this calendar demo",
         width: 600,
         close: function() {
            $about.dialog("destroy");
            $about.hide();
         },
         buttons: {
            close : function() {
               $about.dialog("close");
            }
         }
      }).show();
   });
*/

});

function removeCourseDescription(course_id)
{
   var cal_event_onclick = document.getElementById("cal_event_onclick");
   var to_remove = document.getElementById(course_id);
   cal_event_onclick.removeChild(to_remove);
}
