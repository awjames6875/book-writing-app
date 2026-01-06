# CODING_RULES.md

## Coding Best Practices
- **Name things clearly:** Use descriptive names for variables and functions (e.g., `totalPrice` instead of `tp`).
- **Keep functions short:** Each function should do one thing. Split long functions into smaller ones.
- **Check your spelling:** Use the same spelling for variable and function names everywhere.
- **Don’t repeat yourself:** If you write the same code more than once, turn it into a function.
- **Always test your code:** Run your code after changes to make sure it works as expected.
- **Use comments:** Add short notes to explain tricky parts of your code.
- **Handle errors:** Use `try`/`catch` or similar to handle things that might go wrong.
- **Keep your code neat:** Use consistent spaces and indents for readability.
- **Ask for help:** If you’re stuck, ask someone or look up examples.

## Advanced (Elite) Coding Standards
- **Strong type safety:** Use strict typing everywhere (e.g., TypeScript `strict` mode).
- **Comprehensive automated tests:** Write unit, integration, and end-to-end tests for all features and bug fixes.
- **Continuous Integration/Deployment:** Use CI/CD pipelines to test and deploy code automatically.
- **Peer code reviews:** All code should be reviewed for logic, style, and security.
- **Consistent code style:** Enforce style with Prettier and ESLint, with zero warnings.
- **Documentation:** Document every function, class, and module with clear comments and examples.
- **Error handling and logging:** Handle and log all errors for monitoring and debugging.
- **Performance optimization:** Profile and optimize code for speed and memory where needed.
- **Security best practices:** Follow secure coding standards (e.g., input validation, avoid SQL injection).
- **Scalability and maintainability:** Write modular, reusable, and scalable code.

## When to Refactor
- If your code is hard to read or understand.
- If you see repeated code: combine it into a function.
- If a function is too long or does too many things: break it up.
- If you keep fixing bugs in the same place: refactor for clarity and reliability.
- If adding new features is getting difficult: clean up the code first.

## Efficiency & Saving Credits/Resources
- Write only what you need: don’t add extra features or code you won’t use.
- Reuse code: use functions and modules instead of copying code.
- Test small parts first: catch bugs early to save time and resources.
- Optimize slow parts: make slow code faster if possible.
- Use efficient algorithms: choose the simplest way to solve a problem.
- Automate checks: use tools to catch mistakes before running expensive tasks.

---

**Copy this file into every new project and review it often!**
