**current version**: "@angular/common": "=2.1.2", with parts of the code in NG1

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
