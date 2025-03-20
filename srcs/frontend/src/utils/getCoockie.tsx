/**
 * Gets a cookie by name
 * @param name The name of the cookie to get
 * @returns The cookie value or an empty string if not found
 */
export const getCookie = (name: string): string => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return '';
  };
  
  /**
   * Sets a cookie with an expiration time
   * @param name The name of the cookie
   * @param value The value to set
   * @param expiryMs Time in milliseconds until the cookie expires
   * @param path The cookie path (default: '/')
   * @param secure Whether the cookie should only be sent over HTTPS
   */
  export const setCookie = (
    name: string,
    value: string,
    expiryMs: number,
    path: string = '/',
    secure: boolean = window.location.protocol === 'https:'
  ): void => {
    const expires = new Date(Date.now() + expiryMs).toUTCString();
    const cookieValue = `${name}=${value}; expires=${expires}; path=${path}${secure ? '; secure' : ''}; SameSite=Strict`;
    document.cookie = cookieValue;
  };
  
  /**
   * Removes a cookie by setting its expiration to the past
   * @param name The name of the cookie to remove
   * @param path The cookie path (default: '/')
   */
  export const removeCookie = (name: string, path: string = '/'): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  };