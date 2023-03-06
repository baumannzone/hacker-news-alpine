const BASE_URL = 'https://api.hnpwa.com/v0';
const BASE_DOMAIN = 'https://news.ycombinator.com';

const SECTIONS = {
  top: '/news',
  new: '/newest',
  ask: '/ask',
  show: '/show',
  jobs: '/jobs',
};

// Stories, comments, jobs, Ask HNs and even polls are just items.
// They're identified by their ids, which are unique integers

/**
 * Fetch the stories from the Hacker News API.
 * @param {string} section - The section to fetch.
 * @param {number} page - The page number.
 * @returns {array} stories
 *
 * @example
 * const stories = await getItems('top', 1)
 * console.log(stories) // [{...}, {...}, ...]
 */
const getItems = async (section) => {
  try {
    const res = await fetch(`${BASE_URL}${SECTIONS[section]}/1.json`);
    const stories = await res.json();

    // Return the stories.
    return stories;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Fetch a single item from the Hacker News API.
 * @param {number} id - The item id.
 * @returns {object} item
 *
 * @example
 * const item = await getItem(123)
 * console.log(item) // {...}
 */
const getItem = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/item/${id}.json`);
    const item = await res.json();
    return item;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get a parameter from a URL.
 * @param {string} url - The URL to get the parameter from.
 * @param {string} param - The parameter to get.
 * @returns {string | null} param - The parameter value or null if not found.
 *
 * @example
 * const id = getParam('https://news.ycombinator.com/item?id=123', 'id')
 * console.log(id) // 123
 */
const getParamFromUrl = (url, param) => {
  try {
    const params = new URLSearchParams(url);
    return params.get(param);
  } catch {
    return null;
  }
};

/**
 * Build the user link from the user name.
 * @param {string} user - The user id. Case sensitive.
 * @returns {string} link - The user link.
 * @example
 * const link = buildUserLink('baumannzone')
 * console.log(link) // https://news.ycombinator.com/user?id=baunmannzone
 */
const buildUserLink = (user) => {
  if (!user) {
    throw new Error('User is required');
  }

  return `${BASE_DOMAIN}/user?id=${user}`;
};

/**
 * Build the item link from the item id.
 * @param {number} id - The item id.
 * @returns {string} link - The item link.
 *
 * @example
 * const link = buildItemLink(123)
 * console.log(link) // https://news.ycombinator.com/item?id=123
 */
const buildItemLink = (id) => {
  return `/item.html?id=${id}`;
};

/**
 * Get the comments from an item.
 * @param {object} obj - The item object.
 * @returns {array} comments - The comments array.
 *
 * @example
 * const comments = getComments(item)
 * console.log(comments) // [{...}, {...}, ...]
 */
const getComments = (obj) => {
  comments = [];
  const flattenComments = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (key === 'comments') {
        const comment = {
          id: obj.id,
          user: obj.user,
          level: obj.level,
          time_ago: obj.time_ago,
          content: obj.content,
          url: obj.url,
        };
        // console.log(comment);
        comments.push(comment);
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenComments(obj[key]);
      }
    });
  };

  flattenComments(obj);

  // console.log(comments.length);
  // console.log(comments);
  return comments.slice(1);
};
