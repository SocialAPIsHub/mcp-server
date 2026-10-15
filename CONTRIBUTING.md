# Contributing to SocialAPIs MCP Server

Thank you for your interest in contributing! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/SocialAPIsHub/mcp-server/issues)
2. If not, create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature is already requested
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Why it would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mcp-server.git
cd mcp-server

# Install dependencies
npm install

# Test locally
node mcp-wrapper.js YOUR_API_KEY
```

### Code Style

- Use ES6+ features
- Follow existing code style
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat: add Instagram support
fix: handle pagination edge case
docs: update installation guide
```

### Testing

Before submitting:
1. Test with your API key
2. Verify all tools work
3. Check for console errors
4. Test on different platforms if possible

## Releasing (maintainers)

1. Bump the version in `package.json`, `server.json`, `plugin.json`, `lhm.plugin.json`, `server.js` (`SERVER_VERSION`) and `mcp-wrapper.js`, and add a `CHANGELOG.md` entry. Merge the PR.
2. Publish to npm from `main`: `npm publish`. Check it's live with `npm view @socialapis/mcp version`.
3. Tag the release and push the tag:

   ```bash
   git tag v2.1.1
   git push origin v2.1.1
   ```

   The **Publish to MCP Registry** workflow (`.github/workflows/publish-mcp-registry.yml`) checks the tag matches `server.json`, waits for the version on npm, signs in with GitHub Actions OIDC and publishes `server.json`. No personal registry login is needed. To re-run it, use **Run workflow** on the Actions tab.
4. Update LobeHub: `npx -y @lobehub/market-cli plugin update --dir .`

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Report unacceptable behavior

## Questions?

- Discord: [discord.gg/socialapis](https://discord.gg/socialapis)
- Email: [support@socialapis.io](mailto:support@socialapis.io)

Thank you for contributing! 🎉