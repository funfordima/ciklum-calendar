import create from '../utils/create';
import createNewItem from './createNewItem';
import createItemMember from '../utils/createItemMember';
import catchDecorator from '../utils/catchDecorator';
import createDropDownList from './createDropDownList';
import User from '../utils/User';
import createModalDialog from '../utils/createModalDialog';
import createFooter from './createFooter';
import EventEmitter from '../utils/Emitter';

const EE = new EventEmitter();
EE.subscribe('put-data', (newEvents, id) => catchDecorator()('putData', document.querySelector('.main'), 'events', newEvents, id)
  .then(() => {
    localStorage.setItem('events', JSON.stringify(newEvents));
  }));

EE.subscribe('send-data', (root, members) => catchDecorator()('sendData', root, 'members', members)
  .then(() => {
    localStorage.setItem('members', JSON.stringify(members));
    return Promise.resolve();
  }));

export default class Calendar {
  constructor() {
    this.root = document.getElementById('root');
    this.days = ['Name', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    this.timeLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    this.todos = [];
    this.members = [];
    this.contentContainer = '';
    this.currentUser = null;
    this.isAdmin = false;
    this.id = null;
  }

  createHeader() {
    const header = create('header', 'header', null, this.root);
    const headerTitle = create('h1', 'header__title hvr-float-shadow', null, header);
    const navContainer = create('div', 'header__form_container', null, header);
    const btnContainer = create('div', 'event-btn__container --large', null, navContainer);
    this.btnAddMember = create('button', 'event-btn add-member hide hvr-shutter-out-vertical', 'New Member +', btnContainer,
      ['type', 'submit'], ['value', 'New Member +']);
    this.btnChangeUser = create('button', 'event-btn change-member hvr-sweep-to-right', 'Change User', btnContainer,
      ['type', 'submit'], ['value', 'Change User']);
    const form = create('form', 'header__form', null, navContainer, ['name', 'members-form']);
    const btnFormContainer = create('div', 'event-btn__container', null, form);
    this.menu = create('div', 'menu', null, form, ['data-state', '']);
    this.membersContainer = create('div', 'menu__content', null, this.menu);

    this.menuTitle = create('div', 'menu__title', null, this.menu, ['data-default', ''], ['tabindex', 0]);
    create('div', 'menu__container', this.menu, form);
    this.btnAddItem = create('input', 'event-btn add-event hide', null, btnFormContainer,
      ['type', 'submit'], ['value', 'New Event +']);

    this.resetMenuBtn = create('input', 'event-btn reset-event', null, btnFormContainer,
      ['type', 'reset'], ['value', 'Clear it!']);
    create('a', 'header__title_link', 'Calendar', headerTitle, ['href', '#'], ['alt', 'logo link']);
  }

  async generateMembers(parentElement) {
    const response = await catchDecorator()('getData', null, 'members');
    this.members = await response.json() || [];

    // this.members = this.members[Object.keys(this.members)[Object.keys(this.members).length - 1]];
    this.members = JSON.parse((this.members[this.members.length - 1]).data);
    localStorage.setItem('members', JSON.stringify(this.members));
    // Data.sendData(`${MAIN_URL}members`, this.members.slice(0, 3));
    createItemMember(this.members, parentElement);
    document.querySelectorAll('.menu__content input')
      .forEach((el, indx) => el.setAttribute('id', `${this.members[indx]}_header`));
    document.querySelectorAll('.menu__content label')
      .forEach((el, indx) => el.setAttribute('for', `${this.members[indx]}_header`));
  }

  async createMembers(parentElement) {
    parentElement.innerHTML = '';
    this.generateMembers(parentElement);
  }

  /* eslint no-param-reassign: ["error", { "props": false }] */
  async generateToDoItems(todoList) {
    this.contentContainer.innerHTML = '';
    todoList.forEach(({
      title,
      complete,
      day,
      time,
      participants,
    }) => {
      const todoWrapper = create('div', 'wrap', null, this.contentContainer);
      const todoContainer = create('div', 'main__item', null, todoWrapper,
        ['data-complete', complete], ['data-day', day], ['data-time', time], ['title', participants.join(' ')],
        ['draggable', complete]);

      if (!this.isAdmin) {
        todoContainer.setAttribute('draggable', false);
      }

      create('h3', 'main__item_title', title, todoContainer);
      create('div', 'main__item_btn-close', '&times;', todoContainer, ['tabindex', '0']);
    });

    let isDragging = null;
    const reRenderMain = this.generateToDoItems.bind(this);
    const { id } = this;

    function dragStart() {
      isDragging = this;
      this.className += ' hold';

      setTimeout(() => {
        this.className = 'invisible';
      }, 0);
    }

    function dragEnd() {
      this.className = 'main__item';
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
      this.className += ' hovered';
    }

    function dragLeave() {
      this.className = 'main__item';
    }

    function dragDrop() {
      this.className = 'main__item';

      if (isDragging) {
        const dragStartDay = isDragging.dataset.day;
        const dragStartTime = isDragging.dataset.time;

        const dragEndDay = this.dataset.day;
        const dragEndTime = this.dataset.time;
        const dragParticipants = isDragging.title.split(' ');
        const dragTitle = isDragging.firstChild.textContent;
        const newEvent = {
          title: dragTitle,
          participants: [...dragParticipants],
          day: dragEndDay,
          time: dragEndTime,
          complete: true,
        };

        const events = JSON.parse(localStorage.getItem('events'));

        const newEvents = events.map((eventItem) => {
          const { day, time } = eventItem;

          if (dragStartDay === day && dragStartTime === time) {
            return ({
              title: '',
              participants: [''],
              day: dragStartDay,
              time: dragStartTime,
              complete: false,
            });
          }
          if (dragEndDay === day && dragEndTime === time) {
            return newEvent;
          }

          return eventItem;
        });

        const todoContainer = create('div', 'main__item draggable', null, null,
          ['data-complete', false], ['data-day', dragStartDay], ['data-time', dragStartTime], ['title', ['']],
          ['draggable', false]);
        create('h3', 'main__item_title', '', todoContainer);
        create('div', 'main__item_btn-close', '&times;', todoContainer);

        document.querySelector('.invisible').replaceWith(todoContainer);

        EE.emit('put-data', newEvents, id);
        // .then(() => reRenderMain(newEvents));
        // catchDecorator()('putData', document.querySelector('.main'), 'events', newEvents, id)
        //   .then(() => {
        //     localStorage.setItem('events', JSON.stringify(newEvents));

        reRenderMain(newEvents);
        //   });
      }

      this.replaceWith(isDragging);
      isDragging = null;
    }

    if (this.isAdmin) {
      const fillElements = this.contentContainer.querySelectorAll('div[draggable="true"]');
      const emptiesElements = this.contentContainer.querySelectorAll('div[draggable="false"]');

      emptiesElements.forEach((empty) => {
        empty.addEventListener('dragover', dragOver);
        empty.addEventListener('dragenter', dragEnter);
        empty.addEventListener('dragleave', dragLeave);
        empty.addEventListener('drop', dragDrop);
      });

      fillElements.forEach((fillEl) => fillEl.addEventListener('dragstart', dragStart));
      fillElements.forEach((fillEl) => fillEl.addEventListener('dragend', dragEnd));
    }
  }

  createMain() {
    this.main = create('main', 'main', null, this.root);
    const rowContainer = create('div', 'row-container', null, this.main);
    const columnContainer = create('div', 'col-container', null, this.main);
    this.contentContainer = create('div', 'content-container', null, this.main);

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
      EE.emit('put-data', this.todos, this.id);
      // catchDecorator()('putData', this.root, 'events', this.todos, this.id)
      //   .then(() => {
      //     localStorage.setItem('events', JSON.stringify(this.todos));

      // Rerender ItemToDo
      this.generateToDoItems(this.todos);
      //   });
    }
  }

  handlerAddNewMember(name) {
    const newMember = new User(name);
    const members = JSON.parse(localStorage.getItem('members'));
    members.push(newMember);

    // EE.emit('send-data', this.root, members);
    catchDecorator()('sendData', this.root, 'members', members)
      .then(() => {
        localStorage.setItem('members', JSON.stringify(members));
        this.createMembers(this.membersContainer);
      });
  }

  setCurrentUser(newName) {
    const members = JSON.parse(localStorage.getItem('members'));
    const newCurrentUser = members.find(({ name }) => name === newName);
    this.currentUser = newCurrentUser;
    this.isAdmin = this.currentUser.isAdmin;
  }

  renderModalChooseUser() {
    // Choose user
    const form = create('form', 'modal-form', null, null, ['name', 'modal-form']);
    const memberContainer = create('div', 'modal-form_line', null, form);

    // Members input
    const menuTitleMember = createDropDownList(memberContainer, this.members);
    const menuMember = memberContainer.querySelector('.menu');

    createModalDialog(this.root, 'Please authorise', (name) => {
      this.setCurrentUser(name);

      if (this.isAdmin) {
        this.btnAddMember.classList.remove('hide');
        this.btnAddItem.classList.remove('hide');
      } else {
        this.btnAddMember.classList.add('hide');
        this.btnAddItem.classList.add('hide');
      }

      this.generateToDoItems(this.todos);
    }, form);

    menuMember.addEventListener('click', ({ target }) => {
      if (target.classList.contains('menu__title')) {
        // Toggle menu
        if (menuMember.getAttribute('data-state') === 'active') {
          menuMember.setAttribute('data-state', '');
        } else {
          menuMember.setAttribute('data-state', 'active');
        }
      }

      if (target.classList.contains('menu__label')) {
        // Close when click to input option
        menuTitleMember.textContent = target.textContent;
        menuMember.setAttribute('data-state', '');
      }
    });
  }

  async init() {
    const response = await catchDecorator()('getData', null, 'events');
    this.todos = await response.json() || [];

    // this.todos = this.todos[Object.keys(this.todos)[Object.keys(this.todos).length - 1]];
    this.id = (this.todos[this.todos.length - 1]).id;
    this.todos = JSON.parse((this.todos[this.todos.length - 1]).data);
    localStorage.setItem('events', JSON.stringify(this.todos));

    this.createHeader();
    await this.generateMembers(this.membersContainer);
    this.renderModalChooseUser();
    this.createMain();
    createFooter(this.root);
    this.handlerInputMembers();
  }

  async render() {
    await this.init();

    // Handle Delete Event
    this.contentContainer.addEventListener('click', ({ target }) => {
      if (target.classList.contains('main__item_btn-close')) {
        const eventTitle = target.previousElementSibling.textContent;
        createModalDialog(this.root, `Are you sure you want to delete the event: ${eventTitle}?`,
          this.handlerDeleteEvent.bind(this, target.parentElement));
      }
    });

    // Reset title
    this.resetMenuBtn.addEventListener('click', () => {
      this.menuTitle.textContent = this.menuTitle.getAttribute('data-default');

      this.todos.map((todo) => {
        const members = this.members.map((item) => item.name);

        todo.participants.forEach((member) => {
          if (members.includes(member)) {
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

    // Handle add event
    this.btnAddItem.addEventListener('click', (e) => {
      e.preventDefault();
      createNewItem(document.body, this.members, this.days, this.timeLabels, () => {
        const eventsList = JSON.parse(localStorage.getItem('events'));
        this.generateToDoItems(eventsList);
        this.todos = eventsList;
      });
    });

    // Handle add member
    this.btnAddMember.addEventListener('click', () => {
      const form = create('form', 'modal-form', null, null, ['name', 'modal-form']);
      const memberContainer = create('div', 'modal-form_line', null, form);
      create('p', 'modal-form_label', 'Member', memberContainer);
      create('input', 'modal-form__input', null, memberContainer,
        ['type', 'text'], ['tab-index', '1'], ['name', 'memberName'], ['placeholder', 'add member']);

      createModalDialog(this.root, 'Create new user', (name) => this.handlerAddNewMember(name), form);
    });

    // Handle change user
    this.btnChangeUser.addEventListener('click', () => this.renderModalChooseUser());

    document.querySelector('.author:nth-of-type(2)').addEventListener('click',
      () => new Audio('../src/assets/meow.mp3').play());
  }
}
