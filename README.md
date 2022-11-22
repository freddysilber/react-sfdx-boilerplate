# React SFDX Boilerplate
A simple react project with localhost and production ready code

## Getting Started
- Create a Scratch Org
- Install Dependencies
```bash
cd my-app && npm i
```
- Push Source
```bash
npm run push
```
- Serve
```bash
npm run start -- --app my-app
```

## Build
```bash
cd my-app && npm run build
```

## Production Testing
- Run a new build (above) and push the new assets to your org.
- Make sure to assign the 'My React App' permission set to your User's profile
- Use the 'React App' tab to see the project