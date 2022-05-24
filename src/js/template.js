function templateForItem(value, id) {
  return `<li class="todo__item">
  <input type="checkbox" data-id ="${id}" class="todo__check">
  <p class="todo__value">${value}</p>
  
  <button type="button" class="todo__delete" data-id ="${id}">Delete</button>
  </li>`;
}

export default function template(arr) {
  const toDoDataTemplate = arr.map(({ value, id }) => templateForItem(value, id)).join('');
  return toDoDataTemplate;
}
