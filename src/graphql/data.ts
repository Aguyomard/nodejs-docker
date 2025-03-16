export const users = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', age: 30 },
  { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com', age: 25 },
]

export const materials = [
  { id: '1', name: 'Laptop', quantity: 1 },
  { id: '2', name: 'Notebook', quantity: 3 },
]

export const participants = [
  {
    id: '123',
    name: 'Alice',
    friends: ['124'],
    materials: ['1'],
    invitedBy: '999',
  },
  {
    id: '124',
    name: 'Bob',
    friends: [],
    materials: ['2'],
    invitedBy: null,
  },
  {
    id: '999',
    name: 'David',
    friends: [],
    materials: [],
    invitedBy: null,
  },
]
