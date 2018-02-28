

DROP MATERIALIZED VIEW prelaunch.hierarchy;
CREATE MATERIALIZED VIEW prelaunch.hierarchy as (
  WITH RECURSIVE rec AS (
    SELECT d.id,
      d.first_name,
      d.last_name,
      d.email,
      d.avatar_url,
      d.postal_code,
      d.facebook_id,
      d.facebook_name,
      d.facebook_email,
      d.facebook_avatar,
      d.sponsor_id,
      d.tenant_id,
      ARRAY[d.id] AS path,
      array[]::json[] as children
    FROM prelaunch.registration d
    WHERE d.sponsor_id IS NULL
    UNION ALL
    SELECT d.id,
      d.first_name,
      d.last_name,
      d.email,
      d.avatar_url,
      d.postal_code,
      d.facebook_id,
      d.facebook_name,
      d.facebook_email,
      d.facebook_avatar,
      d.sponsor_id,
      d.tenant_id,
      r.path || d.id AS path,
      (
        select array_agg(row_to_json(r, true))
        from prelaunch.registration r
        where r.sponsor_id = d.id
      ) as children
    FROM prelaunch.registration d
      JOIN rec r ON d.sponsor_id = r.id
  ), data AS (
      SELECT r.id,
        r.first_name,
        r.last_name,
        r.email,
        r.avatar_url,
        r.postal_code,
        r.facebook_id,
        r.facebook_name,
        r.facebook_email,
        r.facebook_avatar,
        r.sponsor_id,
        r.tenant_id,
        r.path,
        array_position(r.path, r.id) AS depth,
        r.children
      FROM rec r
  )
  SELECT d.id,
    d.first_name,
    d.last_name,
    d.email,
    d.avatar_url,
    d.postal_code,
    d.facebook_id,
    d.facebook_name,
    d.facebook_email,
    d.facebook_avatar,
    d.sponsor_id,
    d.tenant_id,
    d.path,
    d.depth,
    d.children
  FROM data d
  ORDER BY d.depth, d.id
);

CREATE UNIQUE INDEX uniq_member_id ON prelaunch.hierarchy(id);
CREATE UNIQUE INDEX gin_path ON prelaunch.hierarchy(path);
