import * as api from './js/api.js';
import template from './js/template.js';
import { Notify } from 'notiflix';

const refs = {
  form: document.querySelector('.todo__form'),
  list: document.querySelector('.todo__list'),
};

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

  const {
    elements: { todo },
  } = evt.currentTarget;

  const newToDO = toDoListDataAdd(todo.value.trim());
  evt.currentTarget.reset();

  if (newToDO.value != '') {
    try {
      await api.createItem(newToDO);
      Notify.success('New task was been created');
      renderListFormApi();
    } catch {
      Notify.failure('Server does not respond ');
    }
  } else {
    Notify.failure('Write what you need');
  }
}

async function onClick(evt) {
  if (evt.target.type === 'button') {
    const idForDelete = Number(evt.target.dataset.id);

    try {
      await api.deleteItem(idForDelete);
      evt.target.parentNode.remove();
      Notify.warning('It has been removed, but hopefully it is done!');
    } catch {
      Notify.failure('Server does not respond ');
    }
  }

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
    whenCheked(evt.target, dataForChange.checked);
  }
}

function toDoListDataAdd(toDoValue) {
  return {
    value: toDoValue,
    checked: false,
  };
}

function deleteItem(idForDelete) {
  const indexForDelete = toDoListData.findIndex(({ id }) => id === idForDelete);
}

async function renderListFormApi() {
  try {
    const list = await api.getList();
    const templateList = template(list);

    refs.list.innerHTML = templateList;

    list.forEach(({ id, checked }) => {
      checker(checked, id);
    });
  } catch {
    Notify.failure('Server does not respond ');
  }
}

function checker(boolean, id) {
  const elem = document.querySelector(`input[data-id="${id}"]`);
  elem.checked = boolean;
  whenCheked(elem, boolean);
}

function whenCheked(elem, boolean) {
  if (boolean) {
    elem.parentNode.style.backgroundColor = 'rgba(144, 238, 144, 0.5)';
  } else {
    elem.parentNode.style.backgroundColor = 'rgba(255, 165, 186,0.5)';
  }
}
