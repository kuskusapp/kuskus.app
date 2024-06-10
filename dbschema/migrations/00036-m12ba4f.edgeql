CREATE MIGRATION m12ba4fadagagxzxku6vcwbcjros2gs3u2fqb4xio3ais77uyzywyq
    ONTO m14zxtnlazvsewhz3s2p7ws7cko7b6cnznog36oqqabkkarhyqogtq
{
  ALTER TYPE default::Post {
      DROP INDEX fts::index ON (fts::with_options(.description, language := fts::Language.eng));
  };
};
