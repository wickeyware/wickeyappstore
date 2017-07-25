# wickeyappstore

AppStore for Progressive WebApps

Check out the tutorial app: https://github.com/wickeyware/was-tutorial

## Installation

To install this library, run:

```bash
$ npm install wickeyappstore --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install wickeyappstore
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { WickeyAppStoreModule } from 'wickeyappstore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify as an import
    WickeyAppStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```xml
<!-- You can now use your library component in app.component.html -->
<h1>
  {{title}}
</h1>
<!-- appID is your WickeyAppStore app ID, and close will be called when app store closes-->
<wickey-appstore [appID]="showXpromote" (close)="closeXpromote($event)"></wickey-appstore>
```

Link CSS, or copy it into your styles.css:
```code
<!-- BOOTSTRAP 4 CSS (required by wickeyappstore) -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
<!-- WickeyAppStore global css-->
<link rel="stylesheet" href="https://unpkg.com/wickeyappstore@0.1.34/styles.css">
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [Michael Wickey](mailto:wickeym@gmail.com)
