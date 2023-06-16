interface QueryAssignedElementContentOptions {
  slotName?: string;
  contentSelector: string;
}

/**
 * A class accessor decorator that converts a class property into a getter
 * which lets you query the content of elements assigned to a slot.
 *
 * Usage (example):
 * ```ts
 * class DecoElement extends HTMLElement {
 *   @queryAssignedElementContent({
 *     contentSelector: 'li',
 *     flatten: true,
 *   })
 *   accessor deco!: Array<HTMLLIElement>;
 *
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     this.shadowRoot!.innerHTML = `<slot name="list"></slot>`;
 *   }
 * }
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
        const { contentSelector, slotName } = options ?? {};

        const slotSelector = slotName
          ? `slot[name=${slotName}]`
          : `slot:not([name])`;

        const slotElement =
          shadowRoot?.querySelector<HTMLSlotElement>(slotSelector);

        const assignedElements = slotElement?.assignedElements({
          ...options,
          flatten: true,
        });

        const slotContent = assignedElements?.length
          ? [...assignedElements[0].querySelectorAll<E>(contentSelector)]
          : [];

        return slotContent;
      },
      init(initValue) {
        console.log({ initValue });
        return initValue;
      },
    };
    return result;
  };
}
