drop view prelaunch.genealogy;
create or replace view prelaunch.genealogy as (
  WITH RECURSIVE rec AS (
    SELECT
      d.*,
      ARRAY [d.id] AS path
    FROM prelaunch.registration d
    WHERE d.sponsor_id IS NULL
    UNION ALL
    SELECT
      d.*,
      r.path || d.id AS path
    FROM prelaunch.registration d
      JOIN rec r ON d.sponsor_id = r.id
  ), data AS (
      SELECT
        *,
        array_position(r.path, r.id) AS depth
      FROM rec r
  )
  SELECT *
  FROM data d
  ORDER BY d.depth, d.id
);