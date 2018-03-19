--
-- extension Github-Oauth2 state SQL schema
--
CREATE TABLE /*_*/`github_states` (
  `state` VARCHAR(255) NOT NULL,
  `return_to` VARCHAR(45) NULL,
  PRIMARY KEY (`state`),
  UNIQUE INDEX `state_UNIQUE` (`state` ASC));
