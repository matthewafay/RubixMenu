export const FACE_COLORS = {
  pizza:   '#ffb648',
  topping: '#88c66b',
  size:    '#5fb1f5',
  crust:   '#d18d5b',
  side:    '#ec7a7a',
  drink:   '#a98ff0',
  submit:  '#ff3b3b',
  blank:   '#1a1a1a',
};

const blank = () => ({ name: '', price: 0, kind: 'blank' });

export const MENU = {
  front: {
    label: 'Pizzas',
    items: [
      { name: 'Pepperoni',   price: 12.99, kind: 'pizza' },
      { name: 'Cheese',      price: 10.99, kind: 'pizza' },
      { name: 'Margherita',  price: 13.49, kind: 'pizza' },
      { name: 'Veggie',      price: 13.99, kind: 'pizza' },
      { name: 'Hawaiian',    price: 13.49, kind: 'pizza' },
      { name: 'Meat Lovers', price: 15.99, kind: 'pizza' },
      { name: 'BBQ Chicken', price: 14.99, kind: 'pizza' },
      { name: 'Buffalo',     price: 14.49, kind: 'pizza' },
      { name: 'Supreme',     price: 15.49, kind: 'pizza' },
    ],
  },
  back: {
    label: 'Toppings',
    items: [
      { name: 'Extra Cheese', price: 1.50, kind: 'topping' },
      { name: 'Pepperoni',    price: 1.75, kind: 'topping' },
      { name: 'Mushroom',     price: 1.25, kind: 'topping' },
      { name: 'Olive',        price: 1.25, kind: 'topping' },
      { name: 'Pepper',       price: 1.00, kind: 'topping' },
      { name: 'Onion',        price: 1.00, kind: 'topping' },
      { name: 'Sausage',      price: 1.75, kind: 'topping' },
      { name: 'Bacon',        price: 2.00, kind: 'topping' },
      { name: 'Pineapple',    price: 1.50, kind: 'topping' },
    ],
  },
  right: {
    label: 'Sizes',
    items: [
      { name: 'Small',  price: 0,    kind: 'size' },
      blank(),
      blank(),
      { name: 'Medium', price: 2.00, kind: 'size' },
      blank(),
      blank(),
      { name: 'Large',  price: 4.00, kind: 'size' },
      blank(),
      blank(),
    ],
  },
  left: {
    label: 'Crusts',
    items: [
      { name: 'Thin',         price: 0,    kind: 'crust' },
      { name: 'Hand-Tossed',  price: 0,    kind: 'crust' },
      { name: 'Stuffed',      price: 2.50, kind: 'crust' },
      { name: 'Gluten-Free',  price: 3.00, kind: 'crust' },
      blank(), blank(), blank(), blank(), blank(),
    ],
  },
  top: {
    label: 'Sides',
    items: [
      { name: 'Breadsticks',     price: 5.99, kind: 'side' },
      { name: 'Cheesy Bread',    price: 6.99, kind: 'side' },
      { name: 'BBQ Wings',       price: 8.99, kind: 'side' },
      { name: 'Buffalo Wings',   price: 8.99, kind: 'side' },
      { name: 'Cinnamon Sticks', price: 5.49, kind: 'side' },
      { name: 'Garlic Knots',    price: 4.99, kind: 'side' },
      { name: 'Salad',           price: 4.49, kind: 'side' },
      { name: 'Fries',           price: 3.49, kind: 'side' },
      { name: 'Mozz Sticks',     price: 6.49, kind: 'side' },
    ],
  },
  bottom: {
    label: 'Drinks + Submit',
    items: [
      { name: 'Coke',       price: 2.49, kind: 'drink' },
      { name: 'Sprite',     price: 2.49, kind: 'drink' },
      { name: 'Diet Coke',  price: 2.49, kind: 'drink' },
      { name: 'Water',      price: 1.49, kind: 'drink' },
      { name: 'Lemonade',   price: 2.99, kind: 'drink' },
      { name: 'Iced Tea',   price: 2.99, kind: 'drink' },
      { name: 'Place Order', price: 0, kind: 'submit' },
      { name: 'Place Order', price: 0, kind: 'submit' },
      { name: 'Place Order', price: 0, kind: 'submit' },
    ],
  },
};
