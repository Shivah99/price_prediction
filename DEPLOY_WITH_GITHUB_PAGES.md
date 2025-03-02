# Deploying Real Estate Price Predictor with GitHub Pages

This guide provides step-by-step instructions for deploying your React application to GitHub Pages.

## What is GitHub Pages?

GitHub Pages is a free hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub and publishes a website. It's perfect for hosting static React applications.

## Prerequisites

- GitHub account
- Git installed locally
- Your React project pushed to GitHub

## Deployment Steps

### 1. Install GitHub Pages package

```bash
npm install --save-dev gh-pages
```

### 2. Update package.json

Add the following to your package.json file:

```json
"homepage": "https://shivah99.github.io/Price_Prediction",
"scripts": {
  // Keep existing scripts
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### 3. Deploy the application

```bash
npm run deploy
```

This command will:
- Build your React application
- Create a branch called 'gh-pages' in your GitHub repository
- Push the build files to this branch

### 4. Configure GitHub Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to "Pages"
4. Ensure the source is set to "Deploy from a branch"
5. Select "gh-pages" as the branch and "/ (root)" as the folder
6. Click "Save"

### 5. Access Your Deployed Application

Your application will be available at:
```
https://shivah99.github.io/Price_Prediction
```

It may take a few minutes for the changes to propagate.

## Updating Your Application

Whenever you want to update your deployed application:

1. Make changes to your code
2. Commit and push to GitHub
3. Run `npm run deploy` again

## Troubleshooting Common Issues

### Blank Page After Deployment

If you see a blank page, check:

1. The "homepage" field in package.json is correct
2. Open browser console for errors
3. Make sure your React Router (if used) is configured with the correct basename:

```jsx
<BrowserRouter basename="/Price_Prediction">
  {/* Your routes */}
</BrowserRouter>
```

### 404 Errors When Refreshing Pages

For single-page applications with client-side routing, create a `404.html` file in the `public` folder with a script that redirects back to index.html:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  Redirecting...
</body>
</html>
```

Then update your `index.html` to handle the redirect:

```html
<!-- Add this script before the closing </head> tag -->
<script type="text/javascript">
  // Single Page Apps for GitHub Pages
  // https://github.com/rafgraph/spa-github-pages
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

## Benefits of GitHub Pages

1. **Free hosting** - No cost for public repositories
2. **Easy deployment** - Simple npm command
3. **Version control** - Deployment history is tracked
4. **CDN** - Content is served through GitHub's global CDN
5. **HTTPS** - Secure connections by default
