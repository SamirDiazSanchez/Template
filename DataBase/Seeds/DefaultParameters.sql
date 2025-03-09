
DECLARE @ProfileId UNIQUEIDENTIFIER = '91d6b495-51d2-43e5-9178-e795c4a690a3';
DECLARE @ProfileName VARCHAR(50) = 'Admin';

DECLARE @UserId UNIQUEIDENTIFIER = 'fe5eed96-0b2a-4e9a-aa2a-ab41a04b1326';
DECLARE @FullName VARCHAR(100) = 'Samir Diaz';
DECLARE @Email VARCHAR(100) = 'samir.diaz.1206@gmail.com';
DECLARE @Modules VARCHAR(MAX) = 'Dashboard,Profile,User';

DECLARE @Date DATETIME = GETUTCDATE();

BEGIN TRANSACTION
BEGIN TRY
  IF NOT EXISTS (SELECT 1 FROM [Profile] WHERE [ProfileName] = @ProfileName OR [ProfileId] = @ProfileId)
  BEGIN
    INSERT INTO [Profile]
    (
      [ProfileId],
      [ProfileName],
      [Modules],
      [Created],
      [Updated]
    )
    VALUES
    (
      @ProfileId,
      @ProfileName,
      @Modules,
      @Date,
      @Date
    );
  END

  IF NOT EXISTS (SELECT 1 FROM [User] WHERE [Email] = @Email OR [UserId] = @UserId)
  BEGIN
    INSERT INTO [User]
    (
      [UserId],
      [Email],
      [FullName],
      [ProfileId],
      [Created],
      [Updated]
    )
    VALUES
    (
      @UserId,
      @Email,
      @FullName,
      @ProfileId,
      @Date,
      @Date
    );
  END

  IF NOT EXISTS (SELECT 1 FROM [User] WHERE [Email] = 'system')
  BEGIN
    INSERT INTO [User]
    (
      [UserId],
      [Email],
      [FullName],    
      [ProfileId],
      [Created],
      [Updated]
    )
    VALUES
    (
      '7524fd93-0781-459f-8c62-52a28ffade7b',
      'system',
      'system',
      @ProfileId,
      @Date,
      @Date
    );
  END

  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
END CATCH