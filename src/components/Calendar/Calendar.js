import './Calendar.scss';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, dateFnsLocalizer,Views} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import Plot from "react-plotly.js";




function User({failedAuth,user}){
//use state to hold emotion data for user
const [graphData,setGraphData] =useState([])
//logic to get emotions data
useEffect(() => {
if(user){
    axios.get(`http://localhost:8080/emotions/${user.id}`)
        .then((response) => {
                setGraphData(response.data)
        })
        .catch((error) => {
            console.log(error);      
      });
}
}, [user]);

    if (failedAuth) {
        return (
            <main>
                <p>You must be logged in to see this page.</p>
                <p><Link to="/login">Log in</Link></p>
            </main>
        );
    }

    if (!user) {
        return (
            <main>
                <p>Loading...</p>
            </main>
        );
    }

// logic for calendar
const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

//logic to display data in calendar format
const calendarData = graphData.map((v) => ({ title: v.emotion, start: v.timestamp, end: v.timestamp}));

//logic to display data in graph format
const emotionCount = graphData.reduce((counts, emotion) => {
    // If the emotion is not yet in the counts object, initialize its count to 0
    if (!counts[emotion.emotion]) {
      counts[emotion.emotion] = 0;
    }
    // Increment the count for the current emotion
    counts[emotion.emotion]++;
    // Return the updated counts object
    return counts;
  }, {});
  
    return(
        <div className='calendar'>
            <h2 className='calendar__title'>Welcome {user.first_name}</h2>

         {  graphData.length>0?  <Calendar className='calendar__calendar'localizer={localizer}
                events={calendarData}
                views={[Views.MONTH, Views.AGENDA]}
                toolbarClassName="my-toolbar-class"
                startAccessor="start"
                endAccessor="end"
                style={{ height: 300, width:450}} />: <span>Loading</span>}

        <div className='calendar__graph'>
        <Plot className='calendar__graph1'
        data={[  
          {type: 'bar', x: Object.keys(emotionCount), y: Object.values(emotionCount)}
        ]}
        layout={ {width: 320, height: 220} } />

      <Plot className='calendar__graph2'
          data={ [{
            values: Object.values(emotionCount),
            labels: Object.keys(emotionCount),
            type: 'pie'
          }]}
          layout={ {height: 220,
            width: 320, margin: {
              l: 0,
              r: 0,
              b: 0,
              t: 0
            },}}/>
        <Plot className='calendar__graph3'
      data={[
        {
          x: Object.keys(emotionCount),
          y: Object.values(emotionCount),
          marker: {
            size: Object.keys(emotionCount)
          }
        }
      ]}
      layout={ {width: 320, height: 220} } />
        </div>
        </div>
    )
}

export default User;