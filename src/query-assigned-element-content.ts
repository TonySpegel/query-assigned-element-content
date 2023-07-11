interface QueryAssignedElementContentOptions {
  /**
   * The selector used to query the content of the slot's assigned elements.
   * Must be a valid CSS selector string.
   * ```html
   * <ul slot="list">
   *   <li>Tethys</li> // ← use a selector to query these elements
   * </ul>
   * ```
   */
  selector: string;
  /**
   * The name of the slot to query elements from.
   * ```html 
   * <ul slot="list"></ul>
   *           ^
   * ```
   * @optional
   */
  slot?: string;
}

/**
 * A class accessor decorator that converts a class property into a getter
 * which lets you query the content of elements assigned to a slot.
 *
 * Usage (example):
 * ```ts
 * class DecoElement extends HTMLElement {
 *   @queryAssignedElementContent({ selector: 'li', slot: 'list' })
 *   private accessor _listElements!: Array<HTMLLIElement>;
 *
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     this.shadowRoot!.innerHTML = `<slot name="list"></slot>`;
 *     // Do something with _listElements :)
 *   }
 * }
 *
 * customElements.define('deco-element', DecoElement);
 * ```
 */
export function queryAssignedElementContent<
  T extends Element,
  E extends Element
>(options: QueryAssignedElementContentOptions) {
  return function (
    _target: ClassAccessorDecoratorTarget<T, E[]>,
    // Context object containing information about the value being decorated
    context: ClassAccessorDecoratorContext<T, E[]>
  ) {
    if (context.kind !== 'accessor') {
      throw new TypeError('Only supported on class accessors');
    }

    const result: ClassAccessorDecoratorResult<T, E[]> = {
      get(this: T) {
        const { shadowRoot } = this;
        const { selector, slot } = options ?? {};

        const slotSelector = slot ? `slot[name=${slot}]` : `slot:not([name])`;

        const slotElement =
          shadowRoot?.querySelector<HTMLSlotElement>(slotSelector);

        const assignedElements = slotElement?.assignedElements({
          ...options,
          flatten: true,
        });

        const slotContent = assignedElements?.length
          ? [...assignedElements[0].querySelectorAll<E>(selector)]
          : [];

        return slotContent;
      },
    };
    return result;
  };
}
