alter table prelaunch.registration ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1001;
alter table prelaunch.registration ALTER COLUMN tenant_id DROP DEFAULT;