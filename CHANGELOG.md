## 0.2.0 (2015-05-29)

  - Upgrade to tsify 0.11.1 (and TypeScript 1.5-beta)

## 0.1.8 (2015-05-15)

  - Throw exception if trying to `require('angular-templates')` in watch-mode. This means you don't have
    to pass an explicit flag for using template-cache, since you can just try to require the module:
    
        try {
            require('angular-templates');
            angularModules.push('angular-templates');
        } catch (ignored) {
            console.debug("running system without template cache");
        }
