import create from '../utils/create';
import createPopUp from '../utils/createPopUp';
import createItemMember from '../utils/createItemMember';
import { URL_EVENTS, URL_MEMBERS } from '../constants/constants';
import Data from '../utils/data';

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

  async getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  }

  async generateMembers(parentElement) {
    this.members = await Data.getData(URL_MEMBERS);
    this.members = this.members[Object.keys(this.members)[Object.keys(this.members).length - 1]];
    localStorage.setItem('members', JSON.stringify(this.members));

    // this.todos = await this.getData('../src/db.json');
    // console.log(this.todos);

    // Data.sendData(URL_EVENTS, this.todos)
    //   .then(() => console.log('success'));

    createItemMember(this.members, parentElement);
    document.querySelectorAll('.menu__content input').forEach((el, indx) => el.setAttribute('id', `${this.members[indx]}_header`));
    document.querySelectorAll('.menu__content label').forEach((el, indx) => el.setAttribute('for', `${this.members[indx]}_header`));
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  async generateToDoItems(parentElement) {
    parentElement.innerHTML = '';
    this.todos.forEach(({
      title,
      complete,
    }) => {
      const todoContainer = create('div', 'main__item', null, parentElement, ['data-complete', complete]);
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

    this.generateToDoItems(this.contentContainer);
  }

  handlerInputMembers() {
    this.menu.addEventListener('click', ({ target }) => {
      switch (true) {
        case (target.classList.contains('menu__title')): {
          // Toggle menu
          if (this.menu.getAttribute('data-state') === 'active') {
            this.menu.setAttribute('data-state', '');
          } else {
            this.menu.setAttribute('data-state', 'active');
          }

          break;
        }

        case (target.classList.contains('menu__label')): {
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
          this.generateToDoItems(this.contentContainer);

          break;
        }

        default: {
          console.warn('something went wrong');
        }
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
      this.generateToDoItems(this.contentContainer);
    });
  }

  async init() {
    this.todos = await Data.getData(URL_EVENTS);
    this.todos = this.todos[Object.keys(this.todos)[Object.keys(this.todos).length - 1]];
    localStorage.setItem('events', JSON.stringify(this.todos));

    const memebersListContainer = this.createHeader();
    this.generateMembers(memebersListContainer);
    this.createMain();
    this.handlerInputMembers();
  }

  async render() {
    await this.init();

    // Handle Event
    this.contentContainer.addEventListener('click', () => {
      console.log('hello');
    });

    this.btnAddItem.addEventListener('click', (e) => {
      e.preventDefault();
      createPopUp(document.body, this.members, this.days, this.timeLabels);
    });
  }
}
