**Error**: XXX is not part of the compilation output. Please check the other error messages for details.
+ https://github.com/angular/angular/issues/20091
+ https://github.com/angular/angular-cli/issues/8284#issuecomment-341417325
+ solution (for us, not general):
  - add all TS code (`@angular`, ``@colabo-*`... libs) into path
  - in `tsconfig.json`

```json
{
  //...
  "include": [
    "src/**/*",
    "node_modules/@colabo-puzzles/**/*",
    "node_modules/@colabo-knalledge/**/*",
    "node_modules/@fdb-stats/**/*",
    "node_modules/@fdb-graph/**/*"
  ]
}
```

**current version**: "@angular/common": "=2.1.2", with parts of the code in NG1

+ **5.1.0-beta.0 (2017-11-08)**

  + **Reverts**
    - feat(elements): implement `[@angular](https://github.com/angular)/elements` [#19469](https://github.com/angular/angular/issues/19469) ([#20152](https://github.com/angular/angular/issues/20152)) ([3997d97](https://github.com/angular/angular/commit/3997d97))

+ **5.0.0 pentagonal-donut (2017-11-01)**

  + **BREAKING CHANGES**

    - **compiler**: Angular now requires **TypeScript** 2.4.x.
    - **compiler**: split compiler and core. `@angular/platform-server` now additionally depends on `@angular/platform-browser-dynamic` as a peer dependency. ([#18683](https://github.com/angular/angular/issues/18683)) ([0cc77b4](https://github.com/angular/angular/commit/0cc77b4))
    - `platformXXXX()` no longer accepts providers which depend on reflection. Specifically the method signature went from `Provider[]` to `StaticProvider[]`.

    Example: Before:

    ```
    [
      MyClass,
      {provide: ClassA, useClass: SubClassA}
    ]


    ```

    After:

    ```
    [
      {provide: MyClass, deps: [Dep1,...]},
      {provide: ClassA, useClass: SubClassA, deps: [Dep1,...]}
    ]

    ```

    NOTE: This only applies to platform creation and providers for the JIT compiler. It does not apply to `@Component` or `@NgModule` provides declarations.

    Benchpress note: Previously Benchpress also supported reflective provides, which now require static providers.

  + **Deprecated code**

    - **compiler**: The method `ngGetContentSelectors()` has been removed as it was deprecated since v4. Use `ComponentFactory.ngContentSelectors` instead.
    - **compiler**: the compiler option `enableLegacyTemplate` is now disabled by default as the `<template>` element was deprecated since v4. Use `<ng-template>` instead. The option `enableLegacyTemplate` and the `<template>` element will both be removed in Angular v6.
    - **compiler**: the option `useDebug` for the compiler has been removed as it had no effect and was deprecated since v4. ([#18778](https://github.com/angular/angular/issues/18778)) ([499d05d](https://github.com/angular/angular/commit/499d05d))
    - **compiler**: deprecate i18n comments in favor of `ng-container` ([#18998](https://github.com/angular/angular/issues/18998)) ([66a5dab](https://github.com/angular/angular/commit/66a5dab))
    - **common**: `NgFor` has been removed as it was deprecated since v4. Use `NgForOf` instead. This does not impact the use of `*ngFor` in your templates. ([#18758](https://github.com/angular/angular/issues/18758)) ([ec56760](https://github.com/angular/angular/commit/ec56760))
    - **common**: `NgTemplateOutlet#ngOutletContext` has been removed as it was deprecated since v4. Use `NgTemplateOutlet#ngTemplateOutletContext` instead. ([#18780](https://github.com/angular/angular/issues/18780)) ([7522987](https://github.com/angular/angular/commit/7522987))
    - **core**: `ErrorHandler` no longer takes a parameter as it was not used and deprecated since v4. ([#18759](https://github.com/angular/angular/issues/18759)) ([8f41326](https://github.com/angular/angular/commit/8f41326))
    - **core**: `ReflectiveInjector` is now deprecated. Use `Injector.create` as a replacement.
    - **core**: `Testability#findBindings` has been removed as it was deprecated since v4. Use `Testability#findProviders`instead. ([#18782](https://github.com/angular/angular/issues/18782)) ([f2a2a6b](https://github.com/angular/angular/commit/f2a2a6b))
    - **core**: `DebugNode#source` has been removed as it was deprecated since v4. ([#18779](https://github.com/angular/angular/issues/18779)) ([d61b902](https://github.com/angular/angular/commit/d61b902))
    - **core**: `OpaqueToken` has been removed as it was deprecated since v4. Use `InjectionToken` instead. ([#18971](https://github.com/angular/angular/issues/18971)) ([3c4eef8](https://github.com/angular/angular/commit/3c4eef8))
    - **core**: `DifferFactory.create` no longer takes ChangeDetectionRef as a first argument as it was not used and deprecated since v4. ([#18757](https://github.com/angular/angular/issues/18757)) ([be9713c](https://github.com/angular/angular/commit/be9713c))
    - **core**: `TrackByFn` has been removed because it was deprecated since v4. Use `TrackByFunction` instead. ([#18757](https://github.com/angular/angular/issues/18757)) ([596e9f4](https://github.com/angular/angular/commit/596e9f4))
    - **http**: deprecate @angular/http in favor of @angular/common/http ([#18906](https://github.com/angular/angular/issues/18906)) ([72c7b6e](https://github.com/angular/angular/commit/72c7b6e))
    - **router**: `RouterOutlet` properties `locationInjector` and `locationFactoryResolver` have been removed as they were deprecated since v4. ([#18781](https://github.com/angular/angular/issues/18781)) ([d1c4a94](https://github.com/angular/angular/commit/d1c4a94), [a9ef858](https://github.com/angular/angular/commit/a9ef858))
    - **router**: the values `true`, `false`, `legacy_enabled` and `legacy_disabled` for the router parameter `initialNavigation`have been removed as they were deprecated. Use `enabled` or `disabled` instead. ([#18781](https://github.com/angular/angular/issues/18781)) ([d76761b](https://github.com/angular/angular/commit/d76761b))
    - **platform-browser**: `NgProbeToken` has been removed from `@angular/platform-browser` as it was deprecated since v4. Import it from `@angular/core` instead. ([#18760](https://github.com/angular/angular/issues/18760)) ([d7f42bf](https://github.com/angular/angular/commit/d7f42bf))
    - **platform-webworker**: `PRIMITIVE` has been removed as it was deprecated since v4. Use `SerializerTypes.PRIMITIVE` instead. ([#18761](https://github.com/angular/angular/issues/18761)) ([a56468c](https://github.com/angular/angular/commit/a56468c))

  + **I18n Changes (@angular/common)**
    Because of multiple bugs and browser inconsistencies, we have dropped the intl api in favor of data exported from the Unicode Common Locale Data Repository (CLDR). Unfortunately we had to change the i18n pipes (date, number, currency, percent) and there are some breaking changes.

    - **Breaking change:**

      - By default Angular now only contains locale data for the language `en-US`, if you set the value of `LOCALE_ID` to another locale, you will have to import new locale data for this language because we don't use the intl API anymore.

    - ##### Date pipe

      - **Breaking change**

        - the predefined formats (`short`, `shortTime`, `shortDate`, `medium`, ...) now use the patterns given by CLDR (like it was in AngularJS) instead of the ones from the intl API. You might notice some changes, e.g. `shortDate` will be `8/15/17` instead of `8/15/2017` for `en-US`.
        - the narrow version of eras is now `GGGGG` instead of `G`, the format `G` is now similar to `GG` and `GGG`.
        - the narrow version of months is now `MMMMM` instead of `L`, the format `L` is now the short standalone version of months.
        - the narrow version of the week day is now `EEEEE` instead of `E`, the format `E` is now similar to `EE` and `EEE`.
        - the timezone `z` will now fallback to `O` and output `GMT+1` instead of the complete zone name (e.g. `Pacific Standard Time`), this is because the quantity of data required to have all the zone names in all of the existing locales is too big.
        - the timezone `Z` will now output the ISO8601 basic format, e.g. `+0100`, you should now use `ZZZZ` to get `GMT+01:00`.

        | Field type | Format        | Example value         | v4   | v5            |
        | ---------- | ------------- | --------------------- | ---- | ------------- |
        | Eras       | Narrow        | A for AD              | G    | GGGGG         |
        | Months     | Narrow        | S for September       | L    | MMMMM         |
        | Week day   | Narrow        | M for Monday          | E    | EEEEE         |
        | Timezone   | Long location | Pacific Standard Time | z    | Not available |
        | Timezone   | Long GMT      | GMT+01:00             | Z    | ZZZZ          |

    - **Currency pipe**

      - **Breaking change**
        - the default value for `symbolDisplay` is now `symbol` instead of `code`. This means that by default you will see `$4.99` for `en-US` instead of `USD4.99` previously.


      - **Deprecation**
        - the second parameter of the currency pipe (`symbolDisplay`) is no longer a boolean, it now takes the values `code`, `symbol` or `symbol-narrow`. A boolean value is still valid for now, but it is deprecated and it will print a warning message in the console.

    - **Percent pipe**

      - **Breaking change**
        - if you don't specify the number of digits to round to, the local format will be used (and it usually rounds numbers to 0 digits, instead of not rounding previously), e.g. `{{ 3.141592 | percent }}` will output `314%` for the locale `en-US` instead of `314.1592%` previously.

+ **4.0.0 invisible-makeover (2017-03-23)**

  + **BREAKING CHANGES**

    From 4.0.0 @angular/core uses a [`WeakMap`](https://github.com/angular/angular/commit/52b21275f4c2c26c46627f5648b41a33bb5c8283), a polyfill needs to be included for [browsers that do not support it natively](http://kangax.github.io/compat-table/es6/#test-WeakMap).

+ **4.0.0-rc.4 (2017-03-17)**

  + **BREAKING CHANGES**

    - Perviously, any provider that had an ngOnDestroy lifecycle hook would be created eagerly.

      Now, only classes that are annotated with @Component, @Directive, @Pipe, @NgModule are eager. Providers only become eager if they are either directly or transitively injected into one of the above.

      This also makes all `useValue` providers eager, which should have no observable impact other than code size.

      **EXPECTED IMPACT**: Making providers eager was an incorrect behavior and never documented. Also, providers that are used by a directive / pipe / ngModule stay eager. So the impact should be rather small.

    - DebugNode.source no longer returns the source location of a node.

      Closes 14013

    - core: (since v4 rc.1)

      - `Renderer2.setStyle` no longer takes booleans but rather a bit mask of flags.

    ## [](https://github.com/angular/angular/compare/2.4.9...2.4.10)

+ **4.0.0-rc.3 (2017-03-10)**

  + **BREAKING CHANGES**

    **since 4.0 rc.1:**

    - rename `RendererV2` to `Renderer2`
    - rename `RendererTypeV2` to `RendererType2`
    - rename `RendererFactoryV2` to `RendererFactory2`

+ **4.0.0-rc.1 (2017-02-24)**

  + **BREAKING CHANGES**

    - core: Because all lifecycle hooks are now interfaces the code that uses 'extends' keyword will no longer compile. Introduced by ([ee747f7](https://github.com/angular/angular/commit/ee747f7)).

      To migrate the code follow the example below:

      Before:

      ```
      @Component()
      class SomeComponent extends OnInit {}

      ```

      After:

      ```
      @Component()
      class SomeComponent implements OnInit {}

      ```

      Based on our research we don't expect anyone to be affected by this change.

    - `RootRenderer` cannot be used any more, use `RendererFactoryV2` instead. Introduced by ([ccb636c](https://github.com/angular/angular/commit/ccb636c)).

      Note: `Renderer` can still be injected/used, but is deprecated.

    **Note**: the 4.0.0-rc.0 release on npm accidentally omitted one bug fix, so we cut rc.1 instead. oops :-)

+ **4.0.0-beta.8 (2017-02-18)**

  + **DEPRECATIONS**
    - core: `KeyValueDifferFactory` and `IterableDifferFactory` no longer have `ChangeDetectorRef` as a parameter. It was not used and has been there for historical reasons. If you call `DifferFactory.create(...)` remove the `ChangeDetectorRef` argument. Introduced by ([#14311](https://github.com/angular/angular/pull/14311)).
  + **BREAKING CHANGES**
    - common: Classes that derive from `AsyncPipe` and override `transform()` might not compile correctly. The much more common use of `async` pipe in templates is unaffected. We expect no or little impact on apps from this change, file an issue if we break you. Introduced by ([#14367](https://github.com/angular/angular/issues/14367)) ([4da7925](https://github.com/angular/angular/commit/4da7925)).
      - Mitigation: Update derived classes of `AsyncPipe` that override `transform()` to include the type parameter overloads.

+ **4.0.0-beta.7 (2017-02-09)**

  + **BREAKING CHANGES**
    - Angular 4 will support only TypeScript 2.1, so we no longer provide backwards compatibility to TS 1.8.

+ **4.0.0-beta.6 (2017-02-03)**

  + common: A definition of `Iterable<T>` is now required to correctly compile Angular applications. Support for `Iterable<T>` is not required at runtime but a type definition `Iterable<T>` must be available.

  `NgFor`, and now `NgForOf<T>`, already supports `Iterable<T>` at runtime. With this change the type definition is updated to reflect this support.

  Migration:

  - add "es2015.iterable.ts" to your tsconfig.json "libs" fields.

  Part of #12398

  - upgrade: Previously, `upgrade/static/downgradeInjectable` returned an array of the form:

  ```
  ['dep1', 'dep2', ..., function factory(dep1, dep2, ...) { ... }]
  ```

  Now it returns a function with an `$inject` property:

  ```
  factory.$inject = ['dep1', 'dep2', ...];
  function factory(dep1, dep2, ...) { ... }
  ```

  It shouldn't affect the behavior of apps, since both forms are equally suitable to be used for registering AngularJS injectable services, but it is possible that type-checking might fail or that current code breaks if it relies on the returned value being an array.

+ **4.0.0-beta.5 (2017-01-25)**

  + **DEPRECATIONS**
    - `OpaqueToken` is now deprecated, use `InjectionToken<T>` instead.
    - `Injector.get(token: any, notFoundValue?: any): any` is now deprecated use the same method which is now overloaded as `Injector.get<T>(token: Type<T>|InjectionToken<T>, notFoundValue?: T): T;`

+ **4.0.0-beta.4 (2017-01-19)**

  + **BREAKING CHANGES**

    + core: - Because `injector.get()` is now parameterized it is possible that code which used to work no longer type checks. Example would be if one injects `Foo` but configures it as `{provide: Foo, useClass: MockFoo}`. The injection instance will be that of `MockFoo` but the type will be `Foo` instead of `any` as in the past. This means that it was possible to call a method on `MockFoo` in the past which now will fail type check. See this example:

    ```
    class Foo {}
    class MockFoo extends Foo {
      setupMock();
    }

    var PROVIDERS = [
      {provide: Foo, useClass: MockFoo}
    ];

    ...

    function myTest(injector: Injector) {
      var foo = injector.get(Foo);
      // This line used to work since `foo` used to be `any` before this
      // change, it will now be `Foo`, and `Foo` does not have `setUpMock()`.
      // The fix is to downcast: `injector.get(Foo) as MockFoo`.
      foo.setUpMock();
    }
    ```

+ **4.0.0-beta.3 (2017-01-11)**

   + **BREAKING CHANGES**
       + core: - **IterableChangeRecord** is now an interface and parameterized on <V>. This should not be an issue unless your code does new IterableChangeRecord which it should not have a reason to do.
       + **KeyValueChangeRecord** is now an interface and parameterized on <V>. This should not be an issue unless your code does new KeyValueChangeRecord which it should not have a reason to do.
   + **DEPRECATION**
       + Deprecate **ngOutletContext.** Use ngTemplateOutletContext instead.
       + **CollectionChangeRecord** is renamed to **IterableChangeRecord**. CollectionChangeRecord is aliased to IterableChangeRecord and is marked as @deprecated. It will be removed in v6.x.x.
       + Deprecate **DefaultIterableDiffer** as it is private class which was erroneously exposed.
       + Deprecate **KeyValueDiffers#factories** as it is private field which was erroneously exposed.
       Deprecate **IterableDiffers#factories** as it is private field which was erroneously exposed.

+ **4.0.0-beta.2 (2017-01-06)**
   + **BREAKING CHANGES**
    ​	core: **SimpleChange** now takes an additional argument that defines whether this is the first change or not. This is a low profile API and we don't expect anyone to be affected by this change. If you are impacted by this change please file an issue. (465516b)
    +
