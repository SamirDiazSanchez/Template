CREATE PROCEDURE [dbo].[Save_User]
	@SessionId UNIQUEIDENTIFIER = NULL,
  @Email VARCHAR(100) = NULL,
	@FullName VARCHAR(100) = NULL,
	@ProfileId UNIQUEIDENTIFIER = NULL,
	@UserCreated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	-- VALIDATE SESSION PARAMETERS
	IF @SessionId IS NULL
	OR @UserCreated IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Parameter is required';
		RETURN;
	END

	-- VALIDATE SESSION
	IF NOT EXISTS (SELECT 1 FROM [Session] WHERE [SessionId] = @SessionId AND [UserId] = @UserCreated)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid account';
		RETURN;
	END

	-- VALIDATE INPUT PARAMETERS
	IF @Email IS NULL
	OR @FullName IS NULL
	OR @ProfileId IS NULL
	OR NOT EXISTS (
		SELECT [ProfileId]
		FROM [Profile]
		WHERE [ProfileId] = @ProfileId
		AND [IsActive] = 1
	)
	BEGIN
		SET @Code = 3;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [User]
		(
			[UserId],
			[Email],
			[FullName],
			[ProfileId],
			[Created],
			[Updated],
			[UserCreated],
			[UserUpdated]
		)
		VALUES
		(
			@Id,
			@Email,
			@FullName,
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
