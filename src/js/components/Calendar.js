import create from '../utils/create';

export default class Calendar {
  constructor(urlToDoData, urlMembersData) {
    this.urlToDoData = urlToDoData;
    this.urlMembersData = urlMembersData;
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
    create('p', 'menu__container', this.menu, form);
    create('input', 'event-btn-add', null, btnContainer, ['type', 'submit'], ['value', 'New Event +']);
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
    this.members = await this.getData(this.urlMembersData);
    this.members.forEach((member, indx) => {
      const option = `
        <input id='select_${indx}' class="menu__input" type="radio" name="select" />
        <label for='select_${indx}' class="menu__label">${member}</label>
      `;
      parentElement.insertAdjacentHTML('beforeend', option);
    });
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  async generateToDoItems(parentElement) {
    parentElement.innerHTML = '';
    this.todos.forEach(({
      title,
      dataCol,
      dataRow,
      complete,
    }) => {
      const todoContainer = create('div', 'main__item', null, parentElement, ['data-col', dataCol], ['data-row', dataRow], ['data-complete', complete]);
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
    this.todos = await this.getData(this.urlToDoData);
    const memebersListContainer = this.createHeader();
    this.generateMembers(memebersListContainer);
    this.createMain();
    this.handlerInputMembers();
  }

  render() {
    this.init();

    // Handle Event
    // this.contentContainer.addEventListener('click', (event) => {
    // });
  }
}
