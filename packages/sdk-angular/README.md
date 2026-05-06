# @telegram-apps/sdk-angular

[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[code-link]: https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/sdk-angular

[npm-link]: https://npmjs.com/package/@telegram-apps/sdk-angular

[npm-badge]: https://img.shields.io/npm/v/@telegram-apps/sdk-angular?logo=npm

[size-badge]: https://img.shields.io/bundlephobia/minzip/@telegram-apps/sdk-angular

[![NPM][npm-badge]][npm-link]
![Size][size-badge]
[![code-badge]][code-link]

Angular bindings for [client SDK](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/2-x).
Includes utilities for comfortable usage of Angular on the Telegram Mini Apps platform.

## Installation

```bash
npm i @telegram-apps/sdk-angular
```

## Usage

### `useSignal`

`useSignal` converts a `@telegram-apps/sdk` signal into an Angular readonly signal that
automatically stays in sync and unsubscribes when the injection context (component, directive,
pipe, or service) is destroyed.

```ts
import { Component } from '@angular/core';
import { backButton, useSignal } from '@telegram-apps/sdk-angular';

@Component({
  selector: 'app-root',
  template: `<button (click)="toggle()">Back button visible: {{ isVisible() }}</button>`,
})
export class AppComponent {
  isVisible = useSignal(backButton.isVisible);

  toggle() {
    backButton.isVisible() ? backButton.hide() : backButton.show();
  }
}
```

All exports from `@telegram-apps/sdk` are also re-exported from this package.
