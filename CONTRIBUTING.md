# Contributing to Stagehand

Thank you for your interest in contributing to Stagehand! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Be open to different perspectives

## How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue already exists
2. Use a clear and descriptive title
3. Provide detailed information about the problem
4. Include steps to reproduce the issue
5. Add relevant environment details (OS, Node version, etc.)

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
   - Ensure all tests pass

4. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```
   Use clear commit messages following conventional commits:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Refactor:` for code refactoring

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Wait for review and feedback

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Stagehand.git
   cd Stagehand
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run playwright:install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Run tests to verify setup:
   ```bash
   npm test
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

## Testing Guidelines

- Write tests for new features
- Ensure existing tests still pass
- Test on multiple browsers/platforms when applicable
- Include edge cases in test coverage

## Documentation

- Update README.md for user-facing changes
- Update SETUP.md for setup/installation changes
- Add code comments for complex logic
- Keep examples up to date

## Questions?

If you have questions, feel free to:
- Open an issue with the `question` label
- Check existing documentation
- Review example test files

Thank you for contributing to Stagehand! 🎭

