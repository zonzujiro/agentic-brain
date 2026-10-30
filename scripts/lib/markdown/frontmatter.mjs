function parseScalar(rawValue) {
  const value = rawValue.trim();

  if (value === "") {
    return "";
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}

export function parseFrontmatter(markdown) {
  markdown = markdown.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  if (!markdown.startsWith("---\n")) {
    return {};
  }

  const closingMarkerIndex = markdown.indexOf("\n---\n", 4);
  if (closingMarkerIndex === -1) {
    return {};
  }

  const frontmatter = markdown.slice(4, closingMarkerIndex);
  const lines = frontmatter.split("\n");
  const result = {};
  let currentNestedKey = null;
  let currentNestedType = null;
  let currentArrayItem = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    if (/^\S/.test(line)) {
      currentNestedKey = null;
      currentNestedType = null;
      currentArrayItem = null;

      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!match) {
        continue;
      }

      const [, key, rawValue] = match;

      if (rawValue === "") {
        result[key] = {};
        currentNestedKey = key;
        currentNestedType = "object";
      } else {
        result[key] = parseScalar(rawValue);
      }

      continue;
    }

    if (!currentNestedKey) {
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      if (currentNestedType !== "array") {
        result[currentNestedKey] = [];
        currentNestedType = "array";
      }

      const itemValue = trimmed.slice(2);
      const inlineObjectMatch = itemValue.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

      if (inlineObjectMatch) {
        const [, nestedKey, rawNestedValue] = inlineObjectMatch;
        currentArrayItem = {
          [nestedKey]: parseScalar(rawNestedValue),
        };
        result[currentNestedKey].push(currentArrayItem);
      } else {
        currentArrayItem = null;
        result[currentNestedKey].push(parseScalar(itemValue));
      }

      continue;
    }

    const nestedMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!nestedMatch) {
      continue;
    }

    if (currentNestedType !== "object") {
      if (currentNestedType === "array" && currentArrayItem && typeof currentArrayItem === "object") {
        const [, nestedKey, rawNestedValue] = nestedMatch;
        currentArrayItem[nestedKey] = parseScalar(rawNestedValue);
        continue;
      }

      result[currentNestedKey] = {};
      currentNestedType = "object";
    }

    const [, nestedKey, rawNestedValue] = nestedMatch;
    result[currentNestedKey][nestedKey] = parseScalar(rawNestedValue);
  }

  return result;
}
