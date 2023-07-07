export function log(str: string) {
  console.log(
    `%c[directus-extension-generate-types]%c\n${str}`,
    "font-weight: bold;"
  );
}

export function warn(str: string) {
  console.warn(
    `%c[directus-extension-generate-types]%c\n${str}`,
    "font-weight: bold;"
  );
}

export function error(str: string) {
  console.error(
    `%c[directus-extension-generate-types]%c\n${str}`,
    "font-weight: bold;"
  );
}
