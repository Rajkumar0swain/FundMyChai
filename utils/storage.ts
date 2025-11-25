
export const encodeData = (data: any): string => {
  try {
    // Encodes object to a Base64 string that is URL safe
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    console.error("Failed to encode data", e);
    return "";
  }
};

export const decodeData = (str: string): any => {
  try {
    // Clean up string just in case of whitespace/newlines from copying
    const cleanStr = str.trim();
    // Decodes Base64 string back to object
    return JSON.parse(decodeURIComponent(atob(cleanStr)));
  } catch (e) {
    console.error("Failed to decode data", e);
    return null;
  }
};
