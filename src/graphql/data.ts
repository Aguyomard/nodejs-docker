export const db = {
  users: [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', age: 30 },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com', age: 25 },
  ],

  materials: [
    { id: '1', name: 'Laptop', quantity: 1 },
    { id: '2', name: 'Notebook', quantity: 3 },
  ],

  participants: [
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
  ],

  posts: [
    {
      id: '1',
      title: 'GraphQL Basics',
      content: 'GraphQL is awesome!',
      authorId: '1',
      published: true,
    },
    {
      id: '2',
      title: 'Advanced GraphQL',
      content: 'Deep dive into GraphQL.',
      authorId: '1',
      published: true,
    },
    {
      id: '3',
      title: 'Vue.js and GraphQL',
      content: 'Using GraphQL with Vue.js.',
      authorId: '2',
      published: true,
    },
  ],

  comments: [
    { id: '1', content: 'Great post!', postId: '1', authorId: '2' },
    { id: '2', content: 'Thanks for sharing!', postId: '1', authorId: '1' },
    { id: '3', content: 'Very informative!', postId: '3', authorId: '2' },
  ],
}
