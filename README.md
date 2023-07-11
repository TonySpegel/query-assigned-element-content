# queryAssignedElementContent

A class accessor decorator that converts a class property into a getter
which lets you query the content of elements assigned to a `<slot>`. 
Use it to simplify the selection of slot content in your web component.

The decorator supports the latest (stage: 3) [TC39 proposal](https://github.com/tc39/proposal-decorators) - which is not yet implemented by browser vendors. However with TypeScript 5 we can use those already.

Some notes:
- using both `experimentalDecorators` and stage 3 decorators in the same file is not possible. In the same project for separate files this could work, but that needs some work and several tsconfig files.
- Some libraries do not yet support the latest decorator proposal
- Even if it is not an `experimentalDecorators` (<span aria-hidden="true">😅</span>) decorator, it is experimental and therefore to be used with that in mind

Feel free to contribute and giving feedback

## Usage

Let's just say we are developing a web component which takes in content using the `slot`-attribute:

```html
<deco-element>
  <ul slot="list">
    <li>Tethys</li> 
    <li>Mimas</li>
  </ul>
</deco-element>
```
The assigned element in this example is a `<ul>` which contains some `<li>` elements. 
We want to select those list items from within the component and toggle a class when clicked. That could look like this:

```ts
import { queryAssignedElementContent } from './query-assigned-element-content.js';

class DecoElement extends HTMLElement {
  @queryAssignedElementContent({ selector: 'li', slot: 'list' })
  private accessor _listElements!: Array<HTMLLIElement>;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<slot name="list"></slot>`;
   
    this._listElements.forEach(listElement =>
      listElement.addEventListener('click', e => {
        (e.target as HTMLLIElement).classList.toggle('active');
      })
    );
  }
}

customElements.define('deco-element', DecoElement);
```

## Motivation

I use the [Lit](https://lit.dev/) library fairly frequently and developed a [component](https://github.com/TonySpegel/toc-observer) a while ago. It highlights links in a table of contents when their corresponding headings appear in your device's viewport. These links come pre-rendered on my personal website from an SSG and must be added using a slot (see my [post](https://tony-spegel.com/blog/toc-observer/) about it).

Using Lit's `@queryAssignedElements` decorator that could look like this (simplified):
```ts
@customElement('toc-observer')
export class TocObserver extends LitElement {
  // ...

  @queryAssignedElements({slot: 'toc'})
  private _tocList?: Array<HTMLUListElement>;

  private get _tocListItems(): HTMLAnchorElement[] | null {
    return this._tocList?.length
      ? [...this._tocList[0].querySelectorAll<HTMLAnchorElement>('[href^="#"]')]
      : null;
  }
}
```

With my decorator this would become:
```ts
@customElement('toc-observer')
export class TocObserver extends LitElement {
  // ...

  @queryAssignedElementContent({
    slotName: 'toc',
    contentSelector: '[href^="#"]',
  })
  private accessor _tocListItems!: Array<HTMLLIElement>;
}
```
Currently this isn't yet supported by Lit but is being worked on to change that. 
My motivation was mainly to simplify my own use case and to familiarize myself with a technical specification and explore it for which not much has been written yet.

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

- [Lit decorator: queryAssignedElements](https://lit.dev/docs/api/decorators/#queryAssignedElements)
- [JavaScript metaprogramming with the 2022-03 decorators API](https://2ality.com/2022/10/javascript-decorators.html)
- [Microsoft: announcing TypeScript 5.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-rc/#decorators)