MediaWiki-OAuth2-Github
==========================

**MediaWiki OAuth2 Github Extension**

OAuth2 extension for MediaWiki to integrate Github as an identity provider.

MediaWiki implementation of the [OAuth2 Client library](https://github.com/kasperrt/OAuth2-Client).


### Configuration

You can load the plugin by putting the following line into your `LocalSettings.php`:

```php
wfLoadExtension( 'MediaWiki-OAuth2-Github' );
```

Required settings in global $wgOAuth2Github (in your `LocalSettings.php`): 

```php
$wgOAuth2Github['client']['id']             = '';
$wgOAuth2Github['client']['secret']         = '';
```

Optional settings in global $wgOAuth2Github (in your `LocalSettings.php`) 

```php
$wgOAuth2Github['config']['required_org']   = 'LosFuzzys';
$wgOAuth2Github['config']['auth_endpoint']  = 'https://github.com/login/oauth/authorize'; 
$wgOAuth2Github['config']['token_endpoint'] = 'https://github.com/login/oauth/access_token';
$wgOAuth2Github['config']['info_endpoint']  = 'https://api.github.com/user';
$wgOAuth2Github['config']['auth_type']      = 'token';
```

The callback url back to your wiki would be:

    http://your.wiki.domain/path/to/wiki/Special:OAuth2Github/callback


### Closed wiki?

 If your Wiki is completely closed (login required for every page), you need to whitelist the plugin's hook:

```php
// whitelist oauth hooks for non-authed users:
$wgWhitelistRead = array('Special:OAuth2Github');
```


### License

MIT

