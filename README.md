<h1 align="center">Calendar</h1>

## This application is a simple meeting planning calendar for a meeting room in your office:

- Display meetings planned;
- Filter meetings for a particular team member;
- Add new meetings;
- Delete meetings;

<h2 align="center"><a href="https://funfordima.github.io/ciklum-calendar/dist/">Live Demo</a></h2>

---

Technologies stack:
- HTML
- SCSS
- JS
- Google Firebase

---

## Project setup

1. Install Node.js
2. Fork this repository: ciklum-calendar
3. Clone your newly created repo: https://github.com/<%your_github_username%>/ciklum-calendar/
4. Go to folder ciklum-calendar
5. To install all dependencies use npm install
6. To start app use npm run build (production mode) or npm run dev (development mode)

## Tech stack
- [x] pure JavaScript (ES6, ES next) with Babel transpiler (if needed) without frameworks;
- [x] any CSS pre/post processor (ex. Sass / Scss / Post-CSS etc.);
- [x] any module bundler (ex. Webpack / Rollup etc.);
- [x] any other technologies that you’d like;

## Prerequisites

- [x] You are building a meeting scheduler application for one meeting room.
- [x] Your application should have two screens: “Calendar” screen and “Create event” screen;
“Calendar” screen consists of a pre-defined table with 5 days (Mon-Fri) for columns and 9 time slots (10:00-18:00, one hour long each) for rows;
- [x] There is a team of several people that can take part in the meetings (you can hardcode the list of team member in your code).
- [x] One meeting can take only 1 hour and obtain one cell in the “Calendar” screen;

## Basic feature requirements

- [x] On a “Calendar” screen user should be able to see all meetings scheduled for the meeting room;
- [x] User should be able to filter meetings by person;
- [x] In order to create new meeting user should click “New Event+” button at “Calendar” screen, after that he should be transferred to “Create event” screen. At that screen 
- [x] user should enter meeting title, select participants (can be multiple), select day (Mon-Fri), select time (10:00-18:00);
- [x] The meeting can be successfully created if and only if the time slot for that day and time is free. Otherwise the error bar should be shown.
- [x] After successful creation of an event, the user should be transferred back to the “Calendar” screen where new event should already be displayed.
- [x] In order to delete a meeting user has to click the delete icon near the meeting title at “Calendar” screen and then confirm his action in a confirmation dialog.
- [x] the minimum page width at which the app is checked for correct display and operation is 500px.

## Hacker scope
- [x] Implement possibility to change meeting day/time using drag and drop technique on “Calendar” view.
- [x] the data is saved in database (ex: firebase) 
