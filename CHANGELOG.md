## 0.1.8 (2015-05-15)

  - Throw exception if trying to `require('angular-templates')` in watch-mode. This means you don't have
    to pass an explicit flag for using template-cache, since you can just try to require the module:
    
        try {
            require('angular-templates');
            angularModules.push('angular-templates');
        } catch (ignored) {
            console.debug("running system without template cache");
        }
