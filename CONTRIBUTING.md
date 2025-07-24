# Contributing to Bocal

Thank you for your interest in contributing to Bocal! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. Check if the issue already exists in the [GitHub Issues](https://github.com/mtlaso/bocal/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Browser, Node.js version)
   - Screenshots if applicable

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/bocal.git
   cd bocal
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   pnpm install
   # Follow the setup instructions in README.md
   ```

4. **Make your changes**
   - Write clear, concise code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

5. **Test your changes**
   ```bash
   pnpm test:run        # Run tests
   pnpm lint           # Check code style
   pnpm type-check     # Check TypeScript types
   pnpm build          # Ensure build works
   ```

6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

## 📝 Code Style Guidelines

### General Principles

- **Readability**: Write code that is easy to read and understand
- **Consistency**: Follow existing patterns and conventions
- **Performance**: Consider performance implications of your changes
- **Accessibility**: Ensure UI changes maintain accessibility standards

### TypeScript

- Use TypeScript strictly - avoid `any` types
- Define proper interfaces and types
- Use generic types when appropriate
- Prefer explicit return types for functions

### React

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use proper prop types and default values

### Naming Conventions

- **Files**: Use kebab-case for file names (`my-component.tsx`)
- **Components**: Use PascalCase (`MyComponent`)
- **Functions**: Use camelCase (`handleClick`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **CSS Classes**: Use kebab-case (`primary-button`)

### Code Organization

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                # Utility functions and hooks
├── db/                 # Database schema and utilities
├── test/               # Test utilities and setup
└── types/              # TypeScript type definitions
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for new features and bug fixes
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies appropriately

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { ... }
    
    // Act
    render(<ComponentName {...props} />)
    
    // Assert
    expect(...).toBeInTheDocument()
  })
})
```

### Running Tests

```bash
pnpm test           # Run in watch mode
pnpm test:run       # Run once
pnpm test:coverage  # Run with coverage
```

## 🔧 Development Tools

### Required Tools

- **Node.js** v18+ 
- **pnpm** for package management
- **Docker** for database setup
- **Git** for version control

### Recommended VS Code Extensions

- TypeScript and JavaScript Language Features
- ESLint (though we use Biome)
- Tailwind CSS IntelliSense
- Auto Rename Tag
- GitLens

### Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix linting issues
pnpm type-check       # Check TypeScript types

# Testing
pnpm test             # Run tests
pnpm test:coverage    # Run with coverage

# Database
pnpm migration:generate   # Generate migrations
pnpm migration:migrate    # Run migrations
```

## 🎯 Project Structure

### Key Directories

- `src/app/[locale]/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and custom hooks
- `src/db/` - Database schema and connection
- `src/test/` - Test utilities and configuration

### Important Files

- `next.config.ts` - Next.js configuration
- `biome.json` - Code formatting and linting rules
- `drizzle.config.ts` - Database configuration
- `vitest.config.ts` - Test configuration

## 🐛 Debugging

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running via Docker
2. **Environment Variables**: Check `.env.local` file exists and is configured
3. **Node Modules**: Try `pnpm install` if packages seem out of sync
4. **Build Issues**: Run `pnpm build` to check for compilation errors

### Debug Tools

- Use React Developer Tools browser extension
- Use `console.log` for debugging (remember to remove before committing)
- Use VS Code debugger for server-side debugging
- Use Drizzle Studio for database inspection

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass (`pnpm test:run`)
- [ ] Linting passes (`pnpm lint`)
- [ ] TypeScript types are correct (`pnpm type-check`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes

## 🔄 Release Process

The project uses automated deployment:

1. Changes are merged to `master` branch
2. GitHub Actions automatically deploy to production
3. Database migrations run automatically during deployment

## 📞 Getting Help

- Create an [issue](https://github.com/mtlaso/bocal/issues) for bug reports
- Start a [discussion](https://github.com/mtlaso/bocal/discussions) for questions
- Check existing documentation in the README

## 📜 License

By contributing to Bocal, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

Thank you for contributing to Bocal! 🎉