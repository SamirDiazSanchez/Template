CREATE TABLE [dbo].[Session]
(
  [SessionId] UNIQUEIDENTIFIER NOT NULL, 
  [UserId] UNIQUEIDENTIFIER NOT NULL, 
  [Created] DATETIME NOT NULL
  CONSTRAINT [FK_Session_ToUser] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [PK_Session] PRIMARY KEY ([SessionId], [UserId])
)
