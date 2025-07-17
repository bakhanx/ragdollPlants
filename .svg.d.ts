declare module '*.svg' {
  import { ComponentType, SVGProps } from 'react';
  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module '*.svg?component' {
  import { ComponentType, SVGProps } from 'react';
  const content: ComponentType<SVGProps<SVGSVGElement>>;
  export default content;
}