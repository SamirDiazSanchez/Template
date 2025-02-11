CREATE PROCEDURE [dbo].[Save_User]
  @Mail VARCHAR(100) = NULL,
	@FullName VARCHAR(100) = NULL,
	@UserName VARCHAR(100) = NULL,
	@ProfileId UNIQUEIDENTIFIER = NULL,
	@UserCreated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN

	IF @UserCreated IS NULL
	OR NOT EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserCreated)
	BEGIN
		SET @Code = 1;
		SET @Message = 'Required parameter';
		RETURN;
	END

	IF @Mail IS NULL
	OR PATINDEX('%[A-Za-z0-9._%+-]%@[A-Za-z0-9.-]%.[A-Za-z]%[A-Za-z]%', @Mail) = 0
	OR @FullName IS NULL
	OR @UserName IS NULL
	OR @ProfileId IS NULL
	OR NOT EXISTS (
		SELECT [ProfileId]
		FROM [Profile]
		WHERE [ProfileId] = @ProfileId
		AND [IsActive] = 1
	)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [User]
		(
			[UserId],
			[Mail],
			[FullName],
			[UserName],
			[ProfileId],
			[Created],
			[Updated],
			[UserCreated],
			[UserUpdated]
		)
		VALUES
		(
			@Id,
			@Mail,
			@FullName,
			@UserName,
			@ProfileId,
			@currentDate,
			@currentDate,
			@UserCreated,
			@UserCreated
		);

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
