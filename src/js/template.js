export default function templateForItem(value, id) {
  return `
  <input type="checkbox" data-id ="${id}" class="todo__check">
  <p class="todo__value">${value}</p>
  
  <button type="button" class="todo__delete" data-id ="${id}">Delete</button>
  `;
}
