import Calendar from './js/components/Calendar';
import './css/style.scss';

const members = ['tamara', 'nick', 'ivan'];

new Calendar(members, '../src/db.json').render();
