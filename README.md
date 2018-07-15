# project-base
The project-base setup for most of my projects, including reusable scripts for common activities.

## Usage

-   Add `project-base` to project 
```bash
$ npm install purtuga/project-base#release/version-here
```

-   Add project-base npm scripts to `package.json`
```bash
$ ./node_modules/.bin/project-base-setup-package-scripts
```

Other things that should be added to package.json:

```json
{
    "esm": { "mode": "auto" }
}
```

## Configuration

Configuration is done via the `project-base` entry in `package.json`. The following are supported:

```json
{
    "package-base": {
        "build-with-web-components-polyfill": true
    }
}
```


## Branches

### Master

Bleeding edge... Everything happens here first and then tagged into a version at stable points... It could break existing projects that reference it.

### vX.Y.Z

Stable version... Project (for the most part) should reference these. When a version becomes "old", warnings will be added and seen during builds.


