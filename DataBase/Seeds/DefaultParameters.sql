
DECLARE @ProfileId UNIQUEIDENTIFIER = '91d6b495-51d2-43e5-9178-e795c4a690a3';
DECLARE @ProfileName VARCHAR(50) = 'Admin';

DECLARE @UserId UNIQUEIDENTIFIER = 'fe5eed96-0b2a-4e9a-aa2a-ab41a04b1326';
DECLARE @UserName VARCHAR(100) = 'samir.diaz.1206@gmail.com';
DECLARE @FullName VARCHAR(100) = 'Samir Diaz';
DECLARE @Mail VARCHAR(100) = 'samir.diaz.1206@gmail.com';
DECLARE @UserModuleId UNIQUEIDENTIFIER = '1781599b-bdbb-41fb-aa6d-ca009f04ff1b';
DECLARE @ProfileModuleId UNIQUEIDENTIFIER = 'fe9f8ebc-fa1a-4f3d-8e61-f1d685ba695f';

DECLARE @Date DATETIME = GETUTCDATE();

IF NOT EXISTS (SELECT 1 FROM [Profile] WHERE [ProfileName] = @ProfileName OR [ProfileId] = @ProfileId)
BEGIN
  INSERT INTO [Profile]
  (
    [ProfileId],
    [ProfileName],
    [Created],
    [Updated]
  )
  VALUES
  (
    @ProfileId,
    @ProfileName,
    @Date,
    @Date
  );
END

IF NOT EXISTS (SELECT 1 FROM [User] WHERE [UserName] = @UserName OR [UserId] = @UserId)
BEGIN
  INSERT INTO [User]
  (
    [UserId],
    [Mail],
    [FullName],
    [UserName],
    [ProfileId],
    [Created],
    [Updated]
  )
  VALUES
  (
    @UserId,
    @Mail,
    @FullName,
    @UserName,
    @ProfileId,
    @Date,
    @Date
  );
END

IF NOT EXISTS (SELECT 1 FROM [Module] WHERE [ModuleName] = 'Profile' OR [ModuleId] = @ProfileModuleId)
BEGIN
  INSERT INTO [Module]
  (
    [ModuleId],
    [ModuleName],
    [Created],
    [Updated],
    [UserCreated],
    [UserUpdated]
  )
  VALUES
  (
    @ProfileModuleId,
    'Profile',
    @Date,
    @Date,
    @UserId,
    @UserId
  );

  INSERT INTO [Profile_Module]
  (
    [ModuleId],
    [ProfileId],
    [UserCreated],
    [UserUpdated],
    [Created],
    [Updated]
  )
  VALUES
  (
    @ProfileModuleId,
    @ProfileId,
    @UserId,
    @UserId,
    @Date,
    @Date
  )
END

IF NOT EXISTS (SELECT 1 FROM [Module] WHERE [ModuleName] = 'User' OR [ModuleId] = @UserModuleId)
BEGIN
  INSERT INTO [Module]
  (
    [ModuleId],
    [ModuleName],
    [Created],
    [Updated],
    [UserCreated],
    [UserUpdated]
  )
  VALUES
  (
    @UserModuleId,
    'User',
    @Date,
    @Date,
    @UserId,
    @UserId
  );

  INSERT INTO [Profile_Module]
  (
    [ModuleId],
    [ProfileId],
    [UserCreated],
    [UserUpdated],
    [Created],
    [Updated]
  )
  VALUES
  (
    @UserModuleId,
    @ProfileId,
    @UserId,
    @UserId,
    @Date,
    @Date
  )
END