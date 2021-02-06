import create from '../utils/create';
import createNewItem from './createNewItem';
import createItemMember from '../utils/createItemMember';
import { URL_EVENTS, URL_MEMBERS } from '../constants/constants';
import Data from '../utils/data';
import { successMsg, errorMsg } from './statusMsg';
import createModalDialog from '../utils/createModalDialog';
import createFooter from './createFooter';

export default class Calendar {
  constructor() {
    this.root = document.getElementById('root');
    this.days = ['Name', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    this.timeLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    this.todos = [];
    this.members = [];
    this.contentContainer = '';
  }

  createHeader() {
    const header = create('header', 'header', null, this.root);
    const headerTitle = create('h1', 'header__title', null, header);
    const navContainer = create('div', 'header__form_container', null, header);
    const form = create('form', 'header__form', null, navContainer, ['name', 'members-form']);
    const btnContainer = create('div', 'event-btn__container', null, form);
    this.menu = create('div', 'menu', null, form, ['data-state', '']);
    const menuContent = create('div', 'menu__content', null, this.menu);

    this.menuTitle = create('div', 'menu__title', null, this.menu, ['data-default', '']);
    create('div', 'menu__container', this.menu, form);
    this.btnAddItem = create('input', 'event-btn-add', null, btnContainer, ['type', 'submit'], ['value', 'New Event +']);
    this.resetMenuBtn = create('input', 'event-btn-reset', null, btnContainer, ['type', 'reset'], ['value', 'Clear it!']);
    create('a', 'header__title_link', 'Calendar', headerTitle, ['href', '#'], ['alt', 'logo link']);

    return menuContent;
  }

  async generateMembers(parentElement) {
    this.members = await Data.getData(URL_MEMBERS);
    this.members = this.members[Object.keys(this.members)[Object.keys(this.members).length - 1]];
    localStorage.setItem('members', JSON.stringify(this.members));

    createItemMember(this.members, parentElement);
    document.querySelectorAll('.menu__content input').forEach((el, indx) => el.setAttribute('id', `${this.members[indx]}_header`));
    document.querySelectorAll('.menu__content label').forEach((el, indx) => el.setAttribute('for', `${this.members[indx]}_header`));
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  async generateToDoItems(todoList) {
    this.contentContainer.innerHTML = '';
    todoList.forEach(({
      title,
      complete,
      day,
      time,
    }) => {
      const todoContainer = create('div', 'main__item', null, this.contentContainer, ['data-complete', complete], ['data-day', day], ['data-time', time]);
      create('h3', 'main__item_title', title, todoContainer);
      create('div', 'main__item_btn-close', '&times;', todoContainer);
    });
  }

  createMain() {
    const main = create('main', 'main', null, this.root);
    const rowContainer = create('div', 'row-container', null, main);
    const columnContainer = create('div', 'col-container', null, main);
    this.contentContainer = create('div', 'content-container', null, main);

    this.days.forEach((dayItem) => {
      create('div', 'main__item', dayItem, rowContainer);
    });

    this.timeLabels.forEach((timeItem) => {
      create('div', 'main__item', timeItem, columnContainer);
    });

    this.generateToDoItems(this.todos);
  }

  handlerInputMembers() {
    this.menu.addEventListener('click', ({ target }) => {
      if (target.classList.contains('menu__title')) {
        // Toggle menu
        if (this.menu.getAttribute('data-state') === 'active') {
          this.menu.setAttribute('data-state', '');
        } else {
          this.menu.setAttribute('data-state', 'active');
        }
      }

      if (target.classList.contains('menu__label')) {
        // Close when click to input option
        this.menuTitle.textContent = target.textContent;
        this.menu.setAttribute('data-state', '');

        // Filter ItemToDo
        const filterCondition = this.menuTitle.textContent;
        this.todos.map((todo) => {
          if (!todo.participants.includes(filterCondition)) {
            todo.complete = false;
          } else {
            todo.complete = true;
          }

          return todo;
        });

        // Rerender ItemToDo
        this.generateToDoItems(this.todos);
      }
    });
  }

  handlerDeleteEvent(el) {
    let isLoad = false;
    const eventDay = el.dataset.day;
    const eventTime = el.dataset.time;
    const newEvent = {
      title: '',
      participants: [''],
      day: eventDay,
      time: eventTime,
      complete: false,
    };

    this.todos = this.todos.map((todo) => {
      if (todo.time === eventTime && todo.day === eventDay) {
        isLoad = true;
        return newEvent;
      }

      return todo;
    });

    if (isLoad) {
      Data.sendData(URL_EVENTS, this.todos)
        .then(() => {
          localStorage.setItem('events', JSON.stringify(this.todos));
          const msg = successMsg('Готово!', this.root);
          // Rerender ItemToDo
          this.generateToDoItems(this.todos);

          setTimeout(() => this.root.removeChild(msg), 2000);
        })
        .catch((error) => {
          const msg = errorMsg(error.message, this.root);

          setTimeout(() => this.root.removeChild(msg), 2000);
        });
    }
  }

  async init() {
    this.todos = await Data.getData(URL_EVENTS);
    this.todos = this.todos[Object.keys(this.todos)[Object.keys(this.todos).length - 1]];
    localStorage.setItem('events', JSON.stringify(this.todos));

    const memebersListContainer = this.createHeader();
    this.generateMembers(memebersListContainer);
    this.createMain();
    createFooter(this.root);
    this.handlerInputMembers();
  }

  async render() {
    await this.init();

    // Handle Delete Event
    this.contentContainer.addEventListener('click', ({ target }) => {
      if (target.classList.contains('main__item_btn-close')) {
        createModalDialog(this.root, 'Вы уверены, что хотите удалить этот ивент?', this.handlerDeleteEvent.bind(this, target.parentElement));
      }
    });

    // Reset title
    this.resetMenuBtn.addEventListener('click', () => {
      this.menuTitle.textContent = this.menuTitle.getAttribute('data-default');

      this.todos.map((todo) => {
        todo.participants.forEach((member) => {
          if (this.members.includes(member)) {
            todo.complete = true;
          } else {
            todo.complete = false;
          }
        });

        return todo;
      });

      // Rerender ItemToDo
      this.generateToDoItems(this.todos);
    });

    this.btnAddItem.addEventListener('click', (e) => {
      e.preventDefault();
      createNewItem(document.body, this.members, this.days, this.timeLabels, () => {
        const eventsList = JSON.parse(localStorage.getItem('events'));
        this.generateToDoItems(eventsList);
        this.todos = eventsList;
      });
    });
  }
}
