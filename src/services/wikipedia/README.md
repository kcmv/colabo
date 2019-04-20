There are few puzzles:

+ **extract4category**: it collects all page for a particular category (`writers` or the right one, not sure what is the name), just links/references and not the page content
+ **collectPages**: uses the output dataset of the `extract4category` puzzle and collects (downloads) all pages about writers
+ **recognizeMigrants**: uses the output dataset of the `extract4category` puzzle and tries to understand which of the writers are migrants, in a sense, they were:
  + living in different cities
  + there is menitioning of migration and similar words
  + born, died in different cities or countries (interesting kind of "migration" is when country changed the name, like Yugoslavio -> Serbia, ...)
  + anything else that makes sense