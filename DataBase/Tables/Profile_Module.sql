CREATE TABLE [dbo].[Profile_Module]
(
  [ModuleId] UNIQUEIDENTIFIER NOT NULL,
  [ProfileId] UNIQUEIDENTIFIER NOT NULL,
  [UserCreated] UNIQUEIDENTIFIER NOT NULL,
  [UserUpdated] UNIQUEIDENTIFIER NOT NULL,
  [Created] DATETIME NOT NULL,
  [Updated] DATETIME NOT NULL,
  [IsActive] BIT NOT NULL DEFAULT 1,
  CONSTRAINT [FK_ProfileModuleCreated_ToUser] FOREIGN KEY ([UserCreated]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_ProfileModuleUpdated_ToUser] FOREIGN KEY ([UserUpdated]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_ProfileModule_ToProfile] FOREIGN KEY ([ProfileId]) REFERENCES [Profile]([ProfileId]),
  CONSTRAINT [FK_ProfileModule_ToModule] FOREIGN KEY ([ModuleId]) REFERENCES [Module]([ModuleId]),
  CONSTRAINT [PK_ProfileModule] PRIMARY KEY (ProfileId, ModuleId)
)
