export const resolvers = {
  hello: ({ name }: { name?: string }) => `Hello ${name || 'world'}!`,
  goodBye: (args: { name?: string }) => `Goodbye ${args.name || 'world'}!`,
  isOver18: () => true,
  age: () => 30,
  weight: () => 70.5,
  hobbies: () => ['reading', 'coding', 'swimming'],
  participant: () => ({
    id: '123',
    name: 'John Doe',
    friends: [
      { id: '456', name: 'Jane Doe' },
      { id: '789', name: 'Jack Doe' },
    ],
    materials: [
      { id: '1', name: 'paper', quantity: 10 },
      { id: '2', name: 'pencil', quantity: 5 },
    ],
  }),
}
