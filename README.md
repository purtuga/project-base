# Base
The base setup for most of my projects, including reusable scripts for common activities.

## Usage

-   Add `base` to project 
```bash
$ npm install purtuga/Base#release/vHere
```

-   Add base npm scripts to `package.json`
```bash
$ ./node_modules/.bin/base-setup-package-scripts
```

Other things that should be added to package.json:

```json
{
    "@std/esm": { "cjs": true, "esm": "js" }
}
```

## Branches

### Master

Bleeding edge... Everything happens here first and then tagged into a version at stable points... It could break existing projects that reference it.

### vX.Y.Z

Stable version... Project (for the most part) should reference these. When a version becomes "old", warnings will be added and seen during builds.


