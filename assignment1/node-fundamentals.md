### 1. What is Node.js?
Node.js is a program that lets us run JavaScript code on our computer or a server, outside of a web browser. It uses Google's V8 engine to execute the code.

### 2. How does Node.js differ from running JavaScript in the browser?
In a web browser, JavaScript is used to control web pages, handle the DOM, and interact with the user interface within a safe sandbox. On the other hand, Node.js runs on a computer or server, so it can read and write files, work with the operating system, and use built-in tools like `fs`, `path`, and `os`.

### 3. What is the V8 engine, and how does Node use it?
The V8 engine is a fast JavaScript engine created by Google for Chrome. Node.js takes this engine and uses it to run JavaScript outside the browser, adding extra features so it can handle server-side tasks.

### 4. What are some key use cases for Node.js?
- Building web servers and APIs.
- Creating command-line tools (CLIs) to make development tasks easier.
- Making real-time apps like live chat.
- Running build tools for projects.

### 5. Explain the difference between CommonJS and ES Modules. Give a code example of each.
CommonJS is the traditional system used in Node.js where we use `require()` to import things and `module.exports` to export them. ES Modules use the modern `import` and `export` keywords.

- **CommonJS Example:**
  ```javascript
  // math.js
  const add = (a, b) => a + b;
  module.exports = { add };

  // app.js
  const { add } = require('./math');
  ```

  - **ES Modules Example:**

  ```javascript

  // math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';