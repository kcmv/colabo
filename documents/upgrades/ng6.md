# ng 6.1.3 -> ng 6.1.9

problems:
+ [[resolved] RxJS 6.3.0 breaks angular flex layout #827](https://github.com/angular/flex-layout/issues/827)
+ [ERROR in node_modules/@angular/flex-layout/extended/typings/style/style.d.ts(72,67) #831](https://github.com/angular/flex-layout/issues/831)

version migrations:
+ "@angular/animations": "=6.1.3" -> "@angular/animations": "=6.1.9",
+ "@angular/material": "=6.4.6", -> "@angular/material": "=6.4.7",
+ "@angular/flex-layout": "=6.0.0-beta.17" -> "@angular/flex-layout": "=6.0.0-beta.18"
+ "rxjs": "^6.2.2", -> "rxjs": "=6.3.3"
    + v6.3.3 breaks "@angular/flex-layout": "=6.0.0-beta.17" so we needed to migrate on higher version
    + [[resolved] RxJS 6.3.0 breaks angular flex layout #827](https://github.com/angular/flex-layout/issues/827)
+ "typescript": "~2.7.2" -> "typescript": "=2.9.2"
    + v3.* breaks CLI
+ PROBLEM
    + sym_links are not followed in typescript 2.9.*