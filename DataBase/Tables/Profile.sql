CREATE TABLE [dbo].[Profile]
(
  [ProfileId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
  [ProfileName] VARCHAR(50) NOT NULL UNIQUE,
  [Modules] VARCHAR(MAX) NULL,
  [Created] DATETIME NOT NULL, 
  [Updated] DATETIME NOT NULL, 
  [UserCreated] UNIQUEIDENTIFIER NULL, 
  [UserUpdated] UNIQUEIDENTIFIER NULL, 
  [IsActive] BIT NOT NULL DEFAULT 1, 
  CONSTRAINT [FK_ProfileCreated_ToUser] FOREIGN KEY ([UserCreated]) REFERENCES [User]([UserId]), 
  CONSTRAINT [FK_ProfileUpdated_ToUser] FOREIGN KEY ([UserUpdated]) REFERENCES [User]([UserId])
)
