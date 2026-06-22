import { Conversation } from './models/conversation.model.js';

// In-memory, modifiable mock data. There is no persistent database — this
// array is the single source of truth for conversations at runtime.
export const conversations: Conversation[] = [
  {
    id: '1',
    title: 'What are the new features in Angular 19?',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm1-0',
        role: 'system',
        content: 'You are a helpful assistant specialized in Angular development.',
        timestamp: new Date('2024-01-20T09:59:59'),
      },
      {
        id: 'm1-1',
        role: 'user',
        content: 'What are the new features and improvements in Angular 19?',
        timestamp: new Date('2024-01-20T10:00:00'),
      },
      {
        id: 'm1-2',
        role: 'assistant',
        content:
          'Angular 19 introduces several exciting new features designed to enhance developer productivity and application performance. One of the standout improvements is the enhanced standalone components support, which simplifies the way developers build and manage components without the need for NgModules. This change streamlines the development process and reduces boilerplate code.\n\nAdditionally, Angular 19 brings improved hydration capabilities for server-side rendering, enabling faster initial page loads and better SEO performance. The framework also updates its compiler and runtime to optimize bundle sizes, resulting in quicker load times and more efficient applications.',
        timestamp: new Date('2024-01-20T10:00:10'),
      },
    ],
    createdAt: new Date('2024-01-20T10:00:00'),
  },
  {
    id: '2',
    title: 'How to create component in angular',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm2-1',
        role: 'user',
        content: 'How to create component in angular',
        timestamp: new Date('2024-01-19T14:30:00'),
      },
      {
        id: 'm2-2',
        role: 'assistant',
        content:
          'To create a component in Angular, you can use the Angular CLI command:\n\n`ng generate component my-component`\n\nor the shorthand:\n\n`ng g c my-component`\n\nThis creates four files: a TypeScript class, an HTML template, a SCSS stylesheet, and a spec file for tests. In modern Angular (v17+), components are standalone by default, meaning they don\'t need to be declared in an NgModule. You can import other components and directives directly in the `imports` array of the `@Component` decorator.',
        timestamp: new Date('2024-01-19T14:30:08'),
      },
      {
        id: 'm2-3',
        role: 'user',
        content: 'What is the difference between standalone and non-standalone components?',
        timestamp: new Date('2024-01-19T14:31:00'),
      },
      {
        id: 'm2-4',
        role: 'assistant',
        content:
          "The key difference is in how they declare their dependencies. Standalone components list all required imports — other components, directives, and pipes — directly in their `@Component` decorator's `imports` array. Non-standalone components must be declared in an NgModule and rely on that module to provide their dependencies.\n\nStandalone components are now the recommended approach in Angular as they are simpler to work with, easier to lazy-load, and reduce the overall boilerplate of your application. Starting with Angular 17, `standalone: true` is the default.",
        timestamp: new Date('2024-01-19T14:31:10'),
      },
    ],
    createdAt: new Date('2024-01-19T14:30:00'),
  },
  {
    id: '3',
    title: 'Angular routing how it works',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm3-1',
        role: 'user',
        content: 'Angular routing how it works',
        timestamp: new Date('2024-01-18T09:15:00'),
      },
      {
        id: 'm3-2',
        role: 'assistant',
        content:
          "Angular's router enables navigation between different views in a single-page application. At its core, routing works by mapping URL paths to components. When a user navigates to a URL, the router finds the matching route and renders the associated component inside a `<router-outlet>` placeholder in the template.\n\nYou define routes as an array of route objects, each with a `path` and a `component` (or `loadComponent` for lazy loading). The router also supports nested routes, route guards for access control, and route resolvers for pre-fetching data before a component loads.",
        timestamp: new Date('2024-01-18T09:15:12'),
      },
    ],
    createdAt: new Date('2024-01-18T09:15:00'),
  },
  {
    id: '4',
    title: 'What is service in angular',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm4-1',
        role: 'user',
        content: 'What is service in angular',
        timestamp: new Date('2024-01-17T16:45:00'),
      },
      {
        id: 'm4-2',
        role: 'assistant',
        content:
          "In Angular, a service is a class that encapsulates business logic, data fetching, or any reusable functionality that should be shared across multiple components. Services follow the single-responsibility principle — they handle one specific concern (like authentication, data fetching, or state management) and provide it to any component that needs it.\n\nServices are provided through Angular's dependency injection (DI) system. By decorating a class with `@Injectable({ providedIn: 'root' })`, you make it available as a singleton throughout your entire application.",
        timestamp: new Date('2024-01-17T16:45:15'),
      },
      {
        id: 'm4-3',
        role: 'user',
        content: 'How do I use inject() in Angular?',
        timestamp: new Date('2024-01-17T16:46:00'),
      },
      {
        id: 'm4-4',
        role: 'assistant',
        content:
          'The `inject()` function is the modern way to access services in Angular (v14+). You call it in an injection context — typically at the class field level — to get an instance of the service.\n\n```typescript\nimport { inject } from \'@angular/core\';\nimport { MyService } from \'./my.service\';\n\n@Component({ ... })\nexport class MyComponent {\n  private myService = inject(MyService);\n}\n```\n\nThe advantage of `inject()` over constructor injection is that it works in standalone functions, directives, and any injection context, making it more flexible and composable.',
        timestamp: new Date('2024-01-17T16:46:20'),
      },
    ],
    createdAt: new Date('2024-01-17T16:45:00'),
  },
  {
    id: '5',
    title: 'Signals vs RxJS observables',
    promptId: 'angular-expert',
    messages: [
      {
        id: 'm5-1',
        role: 'user',
        content: 'What is the difference between Signals and RxJS observables in Angular?',
        timestamp: new Date('2024-01-16T11:00:00'),
      },
      {
        id: 'm5-2',
        role: 'assistant',
        content:
          "Signals and RxJS Observables are both reactive primitives, but they have very different characteristics. Signals are synchronous, always hold a current value, and automatically track their dependencies — you read them like a function call: `mySignal()`. They are simpler and integrate naturally with Angular's change detection.\n\nRxJS Observables are asynchronous streams that may or may not have a current value. They are lazy (nothing happens until you subscribe), can emit multiple values over time, and come with a rich set of operators for transforming, combining, and filtering streams. Observables are better suited for complex async workflows like HTTP requests, WebSockets, or event streams.",
        timestamp: new Date('2024-01-16T11:00:20'),
      },
    ],
    createdAt: new Date('2024-01-16T11:00:00'),
  },
];
