import { Conversation } from './chat.model';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'How to create component in angular',
    createdAt: new Date('2024-12-01T10:00:00'),
    messages: [
      {
        id: 'msg-1-1',
        role: 'user',
        content: 'How to create component in angular',
        timestamp: new Date('2024-12-01T10:00:00'),
      },
      {
        id: 'msg-1-2',
        role: 'assistant',
        content:
          'You can create a component in Angular using the Angular CLI. Run the following command:\n\nng generate component my-component\n\nOr the shorthand: ng g c my-component\n\nThis creates a folder with four files: the TypeScript class, the HTML template, the SCSS stylesheet, and the spec file for testing. In modern Angular (v17+), components are standalone by default, meaning they do not require an NgModule. You can start using the component right away by importing it into any other standalone component or route.',
        timestamp: new Date('2024-12-01T10:00:15'),
      },
      {
        id: 'msg-1-3',
        role: 'user',
        content: 'How do I add an input property to it?',
        timestamp: new Date('2024-12-01T10:01:00'),
      },
      {
        id: 'msg-1-4',
        role: 'assistant',
        content:
          'In modern Angular, use the input() function from @angular/core to declare typed input signals:\n\nimport { input } from \'@angular/core\';\n\ntitle = input<string>();\ncount = input.required<number>();\n\nThis approach is preferred over the @Input() decorator because it integrates with the signals system, giving you fine-grained reactivity. The input() function returns a Signal<T | undefined> for optional inputs, and input.required() returns a Signal<T> for required ones. You can then read the value in your template or computed signals directly: this.title() or this.count().',
        timestamp: new Date('2024-12-01T10:01:20'),
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Angular routing how it works',
    createdAt: new Date('2024-12-02T14:30:00'),
    messages: [
      {
        id: 'msg-2-1',
        role: 'user',
        content: 'Angular routing how it works',
        timestamp: new Date('2024-12-02T14:30:00'),
      },
      {
        id: 'msg-2-2',
        role: 'assistant',
        content:
          'Angular routing lets you map URL paths to components using a routes configuration array. Each route entry specifies a path and a component (or a lazy-loaded module). You configure routing in your app.config.ts by calling provideRouter(routes). The router renders the matched component inside a <router-outlet> element in your template.\n\nLazy loading is strongly recommended for feature areas: instead of a component reference, use loadComponent(() => import(\'./feature/feature\').then(m => m.FeatureComponent)). This splits your bundle and only loads code when the user navigates to that route.',
        timestamp: new Date('2024-12-02T14:30:20'),
      },
      {
        id: 'msg-2-3',
        role: 'user',
        content: 'What are route guards and how do I use them?',
        timestamp: new Date('2024-12-02T14:31:30'),
      },
      {
        id: 'msg-2-4',
        role: 'assistant',
        content:
          'Route guards are functions that decide whether navigation to a route should proceed. The most common type is CanActivateFn. You define it as a plain function:\n\nexport const authGuard: CanActivateFn = () => {\n  const profile = inject(UserProfileService).profile();\n  return profile ? true : inject(Router).createUrlTree([\'/sign-in\']);\n};\n\nThen attach it to a route with canActivate: [authGuard]. Modern Angular guards are functional — no need for classes or implements. They can return boolean, UrlTree, or a Promise/Observable of either.',
        timestamp: new Date('2024-12-02T14:31:55'),
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'What are the new features in Angular 19?',
    createdAt: new Date('2024-12-03T09:15:00'),
    messages: [
      {
        id: 'msg-3-1',
        role: 'user',
        content: 'What are the new features and improvements in Angular 19?',
        timestamp: new Date('2024-12-03T09:15:00'),
      },
      {
        id: 'msg-3-2',
        role: 'assistant',
        content:
          'Angular 19 introduces several exciting new features designed to enhance developer productivity and application performance. One of the standout improvements is the enhanced standalone components support, which simplifies the way developers build and manage components without the need for NgModules. This change streamlines the development process and reduces boilerplate code.\n\nAdditionally, Angular 19 brings improved hydration capabilities for server-side rendering, enabling faster initial page loads and better SEO performance. The framework also updates its compiler and runtime to optimize bundle sizes, resulting in quicker load times and more efficient applications.',
        timestamp: new Date('2024-12-03T09:15:20'),
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'What is service in angular',
    createdAt: new Date('2024-12-04T11:00:00'),
    messages: [
      {
        id: 'msg-4-1',
        role: 'user',
        content: 'What is service in angular',
        timestamp: new Date('2024-12-04T11:00:00'),
      },
      {
        id: 'msg-4-2',
        role: 'assistant',
        content:
          'An Angular service is a class decorated with @Injectable that holds business logic, data access, or shared state. Services are designed to be injected into components or other services via Angular\'s dependency injection system. You declare a service as a singleton application-wide by setting providedIn: \'root\' in the decorator — Angular creates exactly one instance for the whole app.\n\nUse the inject() function (instead of constructor injection) to consume services in components:\n\nprivate authService = inject(AuthService);\n\nServices are the right place for HTTP calls, signal-based state management, and any logic that multiple components need to share.',
        timestamp: new Date('2024-12-04T11:00:22'),
      },
      {
        id: 'msg-4-3',
        role: 'user',
        content: 'How do I share state between components using signals?',
        timestamp: new Date('2024-12-04T11:02:00'),
      },
      {
        id: 'msg-4-4',
        role: 'assistant',
        content:
          'The cleanest pattern is to keep writable signals private in a service and expose them as readonly signals or computed values:\n\n@Injectable({ providedIn: \'root\' })\nexport class CounterService {\n  private count = signal(0);\n  readonly value = this.count.asReadonly();\n  readonly doubled = computed(() => this.count() * 2);\n\n  increment() { this.count.update(n => n + 1); }\n}\n\nAny component that injects CounterService can read value() or doubled() reactively. Because signals are synchronous and fine-grained, Angular only re-renders the parts of the template that actually read a changed signal, making this approach both simple and highly efficient.',
        timestamp: new Date('2024-12-04T11:02:25'),
      },
    ],
  },
];
