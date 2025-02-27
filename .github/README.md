# GitHub Actions Workflows

This directory contains GitHub Actions workflows that automate various tasks for the MessariKit project.

## Workflows

### PR Checks (`pr-checks.yml`)

This workflow runs on pull requests and pushes to master branches (main, master, develop). It ensures that:

- Code passes linting
- API spec validation and generation works
- All packages build successfully
- Tests pass
- TypeScript types check correctly
- Dependencies can be installed without conflicts

## Contributing

When contributing to this project, your PR will automatically be validated by these workflows. Make sure that all checks pass before requesting a review.

## Customizing

To modify these workflows:

1. Edit the YAML files in this directory
2. Commit your changes
3. Push to your branch
4. Create a PR to get your changes reviewed 