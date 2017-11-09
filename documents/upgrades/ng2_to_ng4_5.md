current version: "@angular/common": "=2.1.2", with parts of the code in NG1

+ 4.0.0-beta.3 (2017-01-11)
 + BREAKING CHANGES
  + core: - IterableChangeRecord is now an interface and parameterized on <V>. This should not be an issue unless your code does new IterableChangeRecord which it should not have a reason to do.
  + KeyValueChangeRecord is now an interface and parameterized on <V>. This should not be an issue unless your code does new KeyValueChangeRecord which it should not have a reason to do.
 + DEPRECATION
  + Deprecate ngOutletContext. Use ngTemplateOutletContext instead.
  + CollectionChangeRecord is renamed to IterableChangeRecord. CollectionChangeRecord is aliased to IterableChangeRecord and is marked as @deprecated. It will be removed in v6.x.x.
Deprecate DefaultIterableDiffer as it is private class which was erroneously exposed.
Deprecate KeyValueDiffers#factories as it is private field which was erroneously exposed.
Deprecate IterableDiffers#factories as it is private field which was erroneously exposed.

+ 4.0.0-beta.2 (2017-01-06)
 + BREAKING CHANGES
core: SimpleChange now takes an additional argument that defines whether this is the first change or not. This is a low profile API and we don't expect anyone to be affected by this change. If you are impacted by this change please file an issue. (465516b)
+
