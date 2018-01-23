# Utils for express/connect

Some small utils for express/connect.

## absoluteUrl

If this option is true the request object will be extended by a `absoluteUrl` function.
This function returns the complete absolute Url of the request as a string.
If the application contains a setting `basePath`, the value of that setting will be prepended to the pathname.
If `trust proxy` is enabled, the values of the header fields `x-forwarded-proto` `x-forwarded-host` `x-forwarded-port` are used for the related Url parts.

### Usage

`app.use(require('express-utils')({'absoluteUrl':true}));`

This enables the `absoluteUrl` function.


## defaultSessionParameters

This option can be used to assign default values to properties of the session which are undefined.
This may be useful for default languages, users, etc.

### Usage

`app.use(require('express-utils')({'defaultSessionParameters':{'agent':'http://example.com/card#me'}}));`

This assign the value `'http://example.com/card#me` to the variable `agent` of the session object if the property is undefined.

## Using multiple utils

It's possible to use multiple utils at the same time.

### Usage

`app.use(require('express-utils')({'absoluteUrl':true, 'defaultSessionParameters':{'agent':'http://example.com/card#me'}}));`

Enables the `absoluteUrl` function and sets a default agent if the property is undefined.
