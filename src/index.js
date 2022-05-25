import * as api from './js/api.js';
import template from './js/template.js';
import { Notify } from 'notiflix';
import 'animate.css';

const refs = {
  form: document.querySelector('.todo__form'),
  list: document.querySelector('.todo__list'),
};
const TIMEOUT = 1000;

Notify.init({
  width: '280px',
  position: 'right-bottom',
  distance: '10px',
  opacity: 1,
  fontAwesomeIconStyle: 'shadow',
  cssAnimationStyle: 'from-right',
  clickToClose: true,
});

renderListFormApi();

refs.form.addEventListener('submit', onSubmit);
refs.list.addEventListener('click', onClick);

async function onSubmit(evt) {
  event.preventDefault();

  const element = evt.currentTarget;

  const {
    elements: { todo },
  } = element;

  const newToDO = toDoListDataAdd(todo.value.trim());
  animateAdd('headShake', element);
  element.reset();

  if (newToDO.value != '') {
    try {
      await api.createItem(newToDO);

      Notify.success('New task was been created');

      const response = await api.getList();
      const { value, id, checked } = response[response.length - 1];

      createListItem(value, id, checked);
    } catch {
      Notify.failure('Server does not respond ');
    } finally {
      setInterval(animateRemove, 3000, 'headShake', element);
    }
  } else {
    Notify.failure('Write what you need');
  }
}

async function onClick(evt) {
  // ondelete

  if (evt.target.type === 'button') {
    const idForDelete = Number(evt.target.dataset.id);

    try {
      await api.deleteItem(idForDelete);
      animateAdd('backOutRight', evt.target.parentNode);
      setTimeout(() => evt.target.parentNode.remove(), TIMEOUT);

      Notify.warning('It has been removed, but hopefully it is done!');
    } catch {
      Notify.failure('Server does not respond ');
    }
  }

  // onCheckbox

  if (evt.target.type === 'checkbox') {
    const dataForChange = {
      id: evt.target.dataset.id,
      checked: evt.target.checked,
    };

    try {
      api.putItem(dataForChange.id, dataForChange);
    } catch {
      Notify.failure('Server does not respond ');
    }
    colorWhenCheked(evt.target, dataForChange.checked);
  }
}

function toDoListDataAdd(toDoValue) {
  return {
    value: toDoValue,
    checked: false,
  };
}

async function renderListFormApi() {
  try {
    const list = await api.getList();

    for (let i = 0; i < list.length; i++) {
      setTimeout(() => {
        const { value, id, checked } = list[i];

        createListItem(value, id, checked);
      }, i * 90);
    }
  } catch {
    Notify.failure('Server does not respond ');
  }
}

function createListItem(value, id, checked) {
  const liCreate = document.createElement('li');

  liCreate.classList.add('todo__item');
  liCreate.insertAdjacentHTML('beforeend', template(value, id));
  refs.list.append(liCreate);

  checker(checked, id);
  animateAdd('backInLeft', liCreate);

  setTimeout(animateRemove, TIMEOUT, 'backInLeft', liCreate);
}

function checker(boolean, id) {
  const elem = document.querySelector(`input[data-id="${id}"]`);
  elem.checked = boolean;

  colorWhenCheked(elem, boolean);
  return elem;
}

function colorWhenCheked(elem, boolean) {
  if (boolean) {
    elem.parentNode.style.backgroundColor = 'rgba(144, 238, 144, 0.5)';
  } else {
    elem.parentNode.style.backgroundColor = 'rgba(255, 165, 186,0.5)';
  }
}

function animateAdd(animate, elem) {
  elem.classList.add('animate__animated');
  elem.classList.add(`animate__${animate}`);
}

function animateRemove(animate, elem) {
  elem.classList.remove('animate__animated');
  elem.classList.remove(`animate__${animate}`);
}
