# queryAssignedElementContent

A class accessor decorator that converts a class property into a getter
which lets you query the content of elements assigned to a `<slot>`. Use it to simplify the selection of slot content in your web component.

The decorator supports the latest (stage: 3) [TC39 proposal](https://github.com/tc39/proposal-decorators) - which is not yet implemented by browser vendors. However with TypeScript 5 we can use those already.

## Usage

Let's just say we are developing a web component which takes in content using the `slot`-attribute:

```html
<deco-element>
  <ul slot="list">
    <li>Tethys</li> 
    <li>Telesto</li>
  </ul>
</deco-element>
```
The assigned element in this example is a `<ul>` which contains some `<li>` elements. We want to select those and toggle a class when clicked. That could look like this:

```ts
import { queryAssignedElementContent } from './query-assigned-element-content.js';

class DecoElement extends HTMLElement {
  @queryAssignedElementContent({
    slotName: 'list',
    contentSelector: 'li',
  })
  accessor listElements!: Array<HTMLLIElement>;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<slot name="list"></slot>`;
   
    this.listElements.forEach(listElement =>
      listElement.addEventListener('click', e => {
        (e.target as HTMLLIElement).classList.toggle('active');
      })
    );
  }
}

customElements.define('deco-element', DecoElement);
```

## Installation

```bash
npm i query-assigned-element-content
```

## Development
Install project dependencies
```bash
npm i
```
Run the next two commands in parallel:
```bash
# Build with TS:
npm run build:watch
# Start a webserver:
npm run wds:serve
```

## Inspiration & other useful resources

- https://lit.dev/docs/api/decorators/#queryAssignedElements
- https://2ality.com/2022/10/javascript-decorators.html